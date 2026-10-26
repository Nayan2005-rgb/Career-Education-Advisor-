const pool = require('../config/db');

// Get university statistics
const getUniversityStatistics = async (req, res) => {
  try {
    const { state } = req.query;

    let query = `
      SELECT *
      FROM university_statistics
    `;

    const params = [];

    if (state) {
      query += ` WHERE state_name = ?`;
      params.push(state);
    }

    query += ` ORDER BY state_name`;

    const [rows] = await pool.query(query, params);

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching university statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch university statistics'
    });
  }
};

// Get college statistics
const getCollegeStatistics = async (req, res) => {
  try {
    const { state } = req.query;

    let query = `
      SELECT *
      FROM college_statistics
    `;

    const params = [];

    if (state) {
      query += ` WHERE state_name = ?`;
      params.push(state);
    }

    query += ` ORDER BY state_name`;

    const [rows] = await pool.query(query, params);

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching college statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch college statistics'
    });
  }
};

// Get programmes
const getProgrammes = async (req, res) => {
  try {
    const { discipline } = req.query;

    let query = `
      SELECT p.*, d.discipline_name, d.discipline_level
      FROM programmes p
      LEFT JOIN disciplines d ON p.source_id = d.source_id
    `;

    const params = [];

    if (discipline) {
      query += ` WHERE d.discipline_name = ?`;
      params.push(discipline);
    }

    query += ` ORDER BY p.programme_name`;

    const [rows] = await pool.query(query, params);

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching programmes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch programmes'
    });
  }
};

// Get programme statistics
const getProgrammeStatistics = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    // Parse pagination parameters
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const offset = (pageNum - 1) * limitNum;

    // Get total count of programmes
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM programmes WHERE academic_year = '2023-24'`
    );
    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limitNum);

    // Get programmes with pagination
    const [programmeRows] = await pool.query(
      `SELECT p.id, p.programme_name, p.academic_year,
              pe.all_male, pe.all_female, pe.all_total,
              pe.sc_male, pe.sc_female, pe.sc_total,
              pe.st_male, pe.st_female, pe.st_total,
              pe.obc_male, pe.obc_female, pe.obc_total
       FROM programmes p
       LEFT JOIN programme_enrolment pe ON p.id = pe.programme_id
       WHERE p.academic_year = '2023-24'
       ORDER BY p.programme_name
       LIMIT ? OFFSET ?`,
      [limitNum, offset]
    );

    // Get disciplines separately for dropdown
    const [disciplineRows] = await pool.query(`
      SELECT DISTINCT discipline_name
      FROM disciplines
      WHERE academic_year = '2023-24'
      ORDER BY discipline_name
    `);

    // Get unique discipline names
    const uniqueDisciplines = [...new Set(disciplineRows.map(r => r.discipline_name).filter(Boolean))];

    res.json({
      success: true,
      count: programmeRows.length,
      totalRecords,
      currentPage: pageNum,
      pageSize: limitNum,
      totalPages,
      totalProgrammes: totalRecords,
      disciplineCount: uniqueDisciplines.length,
      academicYear: '2023-24',
      disciplines: uniqueDisciplines,
      data: programmeRows
    });
  } catch (error) {
    console.error('Error fetching programme statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch programme statistics'
    });
  }
};

// Get disciplines
const getDisciplines = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM disciplines
      ORDER BY discipline_name
    `);

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching disciplines:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disciplines'
    });
  }
};

// Get hostel statistics
const getHostelStatistics = async (req, res) => {
  try {
    const { state } = req.query;

    let query = `
      SELECT *
      FROM hostel_statistics
    `;

    const params = [];

    if (state) {
      query += ` WHERE state_name = ?`;
      params.push(state);
    }

    query += ` ORDER BY state_name`;

    const [rows] = await pool.query(query, params);

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching hostel statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hostel statistics'
    });
  }
};

module.exports = {
  getUniversityStatistics,
  getCollegeStatistics,
  getProgrammes,
  getDisciplines,
  getHostelStatistics,
  getProgrammeStatistics
};