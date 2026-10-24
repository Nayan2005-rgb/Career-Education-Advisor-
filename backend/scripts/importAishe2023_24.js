/**
 * AISHE 2023-24 aggregate report importer
 *
 * Input:
 *   backend/data/aishe/AISHE_2023_24.xlsx
 *
 * Install once from backend:
 *   npm install xlsx
 *
 * Run:
 *   node scripts/importAishe2023_24.js
 *
 * This importer intentionally does NOT create fake individual colleges/universities.
 * The supplied AISHE Final Report is an aggregate report by state/type/programme/discipline.
 */

const path = require('path');
const XLSX = require('xlsx');
const pool = require('../config/db');

const FILE = path.join(__dirname, '..', 'data', 'aishe', 'AISHE_2023_24.xlsx');
const YEAR = '2023-24';
const SOURCE_NAME = 'All India Survey on Higher Education (AISHE)';

function n(value) {
  if (value === null || value === undefined || value === '') return 0;
  const x = Number(String(value).replace(/,/g, '').trim());
  return Number.isFinite(x) ? x : 0;
}

function text(value) {
  return value === null || value === undefined ? '' : String(value).trim();
}

function rowsFromSheet(wb, name) {
  const ws = wb.Sheets[name];
  if (!ws) throw new Error(`Worksheet not found: ${name}`);
  return XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: true });
}

async function getSourceId(conn) {
  const [existing] = await conn.query(
    `SELECT id FROM data_sources WHERE source_name = ? AND academic_year = ? LIMIT 1`,
    [SOURCE_NAME, YEAR]
  );

  if (existing.length > 0) {
    await conn.query(
      `UPDATE data_sources SET last_verified_at = CURDATE() WHERE id = ?`,
      [existing[0].id]
    );
    return existing[0].id;
  }

  const [result] = await conn.query(`
    INSERT INTO data_sources
      (source_name, source_type, academic_year, source_url, last_verified_at)
    VALUES
      (?, 'Government of India', ?, 'https://aishe.gov.in/documents/', CURDATE())
  `, [SOURCE_NAME, YEAR]);

  return result.insertId;
}

async function importUniversities(conn, sourceId, wb) {
  const rows = rowsFromSheet(wb, '1.UniNo');
  let count = 0;

  for (let i = 4; i < rows.length; i++) {
    const r = rows[i];
    const state = text(r[1]);
    if (!state || state.toLowerCase() === 'all india') continue;

    await conn.query(`
      INSERT INTO university_statistics
      (state_name, central_university, central_open_university,
       institute_national_importance, state_public_university,
       institute_state_legislature_act, state_open_university,
       state_private_university, deemed_university_government,
       deemed_university_government_aided, deemed_university_private,
       grand_total, private_total, public_total, total,
       source_id, academic_year)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
       central_university=VALUES(central_university),
       central_open_university=VALUES(central_open_university),
       institute_national_importance=VALUES(institute_national_importance),
       state_public_university=VALUES(state_public_university),
       institute_state_legislature_act=VALUES(institute_state_legislature_act),
       state_open_university=VALUES(state_open_university),
       state_private_university=VALUES(state_private_university),
       deemed_university_government=VALUES(deemed_university_government),
       deemed_university_government_aided=VALUES(deemed_university_government_aided),
       deemed_university_private=VALUES(deemed_university_private),
       grand_total=VALUES(grand_total),
       private_total=VALUES(private_total),
       public_total=VALUES(public_total),
       total=VALUES(total)
    `, [
      state, n(r[2]), n(r[3]), n(r[4]), n(r[5]), n(r[6]), n(r[7]),
      n(r[8]), n(r[9]), n(r[10]), n(r[11]), n(r[12]), n(r[13]),
      n(r[14]), n(r[15]), sourceId, YEAR
    ]);
    count++;
  }
  return count;
}

async function importColleges(conn, sourceId, wb) {
  const rangeRows = rowsFromSheet(wb, '3Collegerange');
  const indicatorRows = rowsFromSheet(wb, '4CollegeIndicator');

  const indicator = new Map();
  for (let i = 4; i < indicatorRows.length; i++) {
    const r = indicatorRows[i];
    const state = text(r[1]);
    if (state) indicator.set(state, r);
  }

  let count = 0;
  for (let i = 4; i < rangeRows.length; i++) {
    const r = rangeRows[i];
    const state = text(r[1]);
    if (!state || state.toLowerCase() === 'all india') continue;

    const ind = indicator.get(state) || [];
    await conn.query(`
      INSERT INTO college_statistics
      (state_name, total_districts_with_institution,
       districts_with_universities, universities_in_those_districts,
       districts_with_colleges, colleges_in_those_districts,
       number_of_colleges, colleges_per_lakh_population,
       colleges_responded, average_enrolment, source_id, academic_year)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
       total_districts_with_institution=VALUES(total_districts_with_institution),
       districts_with_universities=VALUES(districts_with_universities),
       universities_in_those_districts=VALUES(universities_in_those_districts),
       districts_with_colleges=VALUES(districts_with_colleges),
       colleges_in_those_districts=VALUES(colleges_in_those_districts),
       number_of_colleges=VALUES(number_of_colleges),
       colleges_per_lakh_population=VALUES(colleges_per_lakh_population),
       colleges_responded=VALUES(colleges_responded),
       average_enrolment=VALUES(average_enrolment)
    `, [
      state, n(r[2]), n(r[3]), n(r[4]), n(r[5]), n(r[6]),
      n(ind[2]), Number(ind[3]) || null, n(ind[4]), Number(ind[5]) || null,
      sourceId, YEAR
    ]);
    count++;
  }
  return count;
}

async function importProgrammes(conn, sourceId, wb) {
  const rows = rowsFromSheet(wb, '11Programme');
  let count = 0;

  for (let i = 4; i < rows.length; i++) {
    const r = rows[i];
    const programme = text(r[1]);
    if (!programme) continue;

    await conn.query(`
      INSERT INTO programmes (programme_name, source_id, academic_year)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE programme_name=VALUES(programme_name)
    `, [programme, sourceId, YEAR]);

    const [p] = await conn.query(
      `SELECT id FROM programmes WHERE programme_name=? AND source_id=? AND academic_year=? LIMIT 1`,
      [programme, sourceId, YEAR]
    );
    const programmeId = p[0].id;

    await conn.query(`
      INSERT INTO programme_enrolment
      (programme_id, all_male, all_female, all_total,
       sc_male, sc_female, sc_total,
       st_male, st_female, st_total,
       obc_male, obc_female, obc_total,
       source_id, academic_year)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
       all_male=VALUES(all_male), all_female=VALUES(all_female), all_total=VALUES(all_total),
       sc_male=VALUES(sc_male), sc_female=VALUES(sc_female), sc_total=VALUES(sc_total),
       st_male=VALUES(st_male), st_female=VALUES(st_female), st_total=VALUES(st_total),
       obc_male=VALUES(obc_male), obc_female=VALUES(obc_female), obc_total=VALUES(obc_total)
    `, [
      programmeId,
      n(r[2]), n(r[3]), n(r[4]),
      n(r[5]), n(r[6]), n(r[7]),
      n(r[8]), n(r[9]), n(r[10]),
      n(r[11]), n(r[12]), n(r[13]),
      sourceId, YEAR
    ]);
    count++;
  }
  return count;
}

async function importDisciplines(conn, sourceId, wb) {
  let count = 0;

  // UG: sheet 12UGDisc  (note trailing space in the actual workbook name)
  const ugRows = rowsFromSheet(wb, '12UGDisc ');
  for (let i = 3; i < ugRows.length; i++) {
    const r = ugRows[i];
    const name = text(r[1]);
    if (!name) continue;

    await conn.query(`
      INSERT INTO disciplines
      (discipline_name, discipline_level, source_id, academic_year)
      VALUES (?, 'UG', ?, ?)
      ON DUPLICATE KEY UPDATE discipline_name=VALUES(discipline_name)
    `, [name, sourceId, YEAR]);

    const [d] = await conn.query(
      `SELECT id FROM disciplines WHERE discipline_name=? AND discipline_level='UG' AND source_id=? AND academic_year=? LIMIT 1`,
      [name, sourceId, YEAR]
    );

    await conn.query(`
      INSERT INTO discipline_enrolment
      (discipline_id, level_type, male, female, total, source_id, academic_year)
      VALUES (?, 'UG', ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE male=VALUES(male), female=VALUES(female), total=VALUES(total)
    `, [d[0].id, n(r[3]), n(r[4]), n(r[5]), sourceId, YEAR]);
    count++;
  }

  // PG/PhD/MPhil: sheet 13PGDisc
  const pgRows = rowsFromSheet(wb, '13PGDisc');
  for (let i = 4; i < pgRows.length; i++) {
    const r = pgRows[i];
    const name = text(r[1]);
    if (!name) continue;

    // Columns 4-6 = PhD, 7-9 = MPhil, 10-12 = PG.
    const levels = [
      ['PHD', 3], ['MPHIL', 6], ['PG', 9]
    ];

    for (const [level, base] of levels) {
      const male = r[base], female = r[base + 1], total = r[base + 2];
      if (male === null && female === null && total === null) continue;

      await conn.query(`
        INSERT INTO disciplines
        (discipline_name, discipline_level, source_id, academic_year)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE discipline_name=VALUES(discipline_name)
      `, [name, level, sourceId, YEAR]);

      const [d] = await conn.query(
        `SELECT id FROM disciplines WHERE discipline_name=? AND discipline_level=? AND source_id=? AND academic_year=? LIMIT 1`,
        [name, level, sourceId, YEAR]
      );

      await conn.query(`
        INSERT INTO discipline_enrolment
        (discipline_id, level_type, male, female, total, source_id, academic_year)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE male=VALUES(male), female=VALUES(female), total=VALUES(total)
      `, [d[0].id, level, n(male), n(female), n(total), sourceId, YEAR]);
    }
    count++;
  }

  return count;
}

async function importHostels(conn, sourceId, wb) {
  const rows = rowsFromSheet(wb, '31Hostelstate ');
  let count = 0;

  for (let i = 4; i < rows.length; i++) {
    const r = rows[i];
    const state = text(r[1]);
    if (!state || state.toLowerCase() === 'all india') continue;

    await conn.query(`
      INSERT INTO hostel_statistics
      (state_name,
       boys_hostel_number, boys_hostel_intake, boys_hostel_residing,
       girls_hostel_number, girls_hostel_intake, girls_hostel_residing,
       other_hostel_number, other_hostel_intake, other_hostel_residing,
       total_hostel_number, total_hostel_intake, total_hostel_residing,
       source_id, academic_year)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
       boys_hostel_number=VALUES(boys_hostel_number),
       boys_hostel_intake=VALUES(boys_hostel_intake),
       boys_hostel_residing=VALUES(boys_hostel_residing),
       girls_hostel_number=VALUES(girls_hostel_number),
       girls_hostel_intake=VALUES(girls_hostel_intake),
       girls_hostel_residing=VALUES(girls_hostel_residing),
       other_hostel_number=VALUES(other_hostel_number),
       other_hostel_intake=VALUES(other_hostel_intake),
       other_hostel_residing=VALUES(other_hostel_residing),
       total_hostel_number=VALUES(total_hostel_number),
       total_hostel_intake=VALUES(total_hostel_intake),
       total_hostel_residing=VALUES(total_hostel_residing)
    `, [
      state,
      n(r[2]), n(r[3]), n(r[4]),
      n(r[5]), n(r[6]), n(r[7]),
      n(r[8]), n(r[9]), n(r[10]),
      n(r[11]), n(r[12]), n(r[13]),
      sourceId, YEAR
    ]);
    count++;
  }
  return count;
}

async function main() {
  console.log(`Reading AISHE workbook: ${FILE}`);

  const wb = XLSX.readFile(FILE, { cellDates: false });
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const sourceId = await getSourceId(conn);
    const universities = await importUniversities(conn, sourceId, wb);
    const colleges = await importColleges(conn, sourceId, wb);
    const programmes = await importProgrammes(conn, sourceId, wb);
    const disciplines = await importDisciplines(conn, sourceId, wb);
    const hostels = await importHostels(conn, sourceId, wb);

    await conn.commit();

    console.log('\nAISHE 2023-24 import completed.');
    console.log(`University state statistics: ${universities}`);
    console.log(`College state statistics: ${colleges}`);
    console.log(`Programmes: ${programmes}`);
    console.log(`Discipline groups: ${disciplines}`);
    console.log(`Hostel state statistics: ${hostels}`);
    console.log('\nIndividual college/university directory rows were NOT invented from this aggregate report.');
  } catch (error) {
    await conn.rollback();
    console.error('\nAISHE import failed:', error.message);
    process.exitCode = 1;
  } finally {
    conn.release();
    await pool.end();
  }
}

main();
