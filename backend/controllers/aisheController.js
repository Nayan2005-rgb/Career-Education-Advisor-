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
    const { discipline } = req.query;

    // Get unique programmes
    let programmeQuery = `
      SELECT DISTINCT
        programme_name,
        academic_year
      FROM programmes
    `;

    const programmeParams = [];

    if (discipline) {
      // For now, return all programmes since discipline filtering requires proper joins
      // Future enhancement: Implement proper discipline-programme relationship
    }

    programmeQuery += ` ORDER BY programme_name LIMIT 100`;

    const [programmeRows] = await pool.query(programmeQuery, programmeParams);

    // Get disciplines separately
    const [disciplineRows] = await pool.query(`
      SELECT DISTINCT discipline_name, discipline_level
      FROM disciplines
      ORDER BY discipline_name
    `);

    // Get unique disciplines
    const uniqueDisciplines = [...new Set(disciplineRows.map(r => r.discipline_name).filter(Boolean))];

    res.json({
      success: true,
      count: programmeRows.length,
      totalProgrammes: 263,
      disciplineCount: uniqueDisciplines.length,
      academicYear: programmeRows[0]?.academic_year || '2023-24',
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