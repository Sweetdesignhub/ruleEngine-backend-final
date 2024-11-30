/**
 * File: 
 * Description:
 *
 * Developed by: Harish
 * Developed on: 29-11-2024
 *
 * Updated by: [Name] 
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import pkg from 'pg';
const { Pool } = pkg;

async function fetchDatabaseDetails(pool) {
  try {
    const client = await pool.connect();
    // Get list of tables
    const tablesRes = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);

    const tables = tablesRes.rows.map((row) => row.table_name);
    const columns = {};

    // Get columns for each table
    for (const table of tables) {
      const columnsRes = await client.query(
        `
          SELECT column_name, is_nullable, data_type 
          FROM information_schema.columns 
          WHERE table_name = $1
        `,
        [table]
      );

      columns[table] = columnsRes.rows.map((row) => ({
        column_name: row.column_name,
        is_nullable: row.is_nullable === "YES",
        data_type: row.data_type,
      }));
    }

    client.release();
    return { tables, columns };
  } catch (error) {
    console.error("Error fetching database details:", error);
    throw new Error("Failed to fetch database details");
  } finally {
    pool.end();
  }
}

// Function to fetch table data
async function getTableData(req, res) {
  const { dbConfig, table, columns } = req.body;
  const pool = new Pool(dbConfig);

  try {
    const cols = columns && columns.length ? columns.join(", ") : "*";
    const query = `SELECT ${cols} FROM ${table};`;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await pool.end();
  }
}

// Function to get database details
async function getDatabaseDetails(req, res) {
  const { host, port, database, username, password } = req.body;
  const pool = new Pool({ user: username, host, database, password, port });

  try {
    const details = await fetchDatabaseDetails(pool);
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Function to insert data into a table
async function insertTableData(req, res) {
  const { dbConfig, table, columnData } = req.body;
  const pool = new Pool(dbConfig);

  try {
    const cols = Object.keys(columnData).join(", ");
    const values = Object.values(columnData);
    const query = `INSERT INTO ${table} (${cols}) VALUES (${values.map((_, i) => `$${i + 1}`).join(", ")}) RETURNING *;`;
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await pool.end();
  }
}

// Function to handle JOIN queries
async function joinTableData(req, res) {
  const { dbConfig, data } = req.body;
  const { joinType, primaryTable, tables, primaryColumn, columns } = data;
  const pool = new Pool(dbConfig);

  try {
    const secondaryTable = tables.find((table) => table !== primaryTable);
    const table1Cols = columns[primaryTable].map(col => `t1.${col}`).join(", ") || "*";
    const table2Cols = columns[secondaryTable].map(col => `t2.${col}`).join(", ") || "*";

    const query = `
      SELECT ${table1Cols}, ${table2Cols}
      FROM ${primaryTable} AS t1
      ${joinType.toUpperCase()} JOIN ${secondaryTable} AS t2
      ON t1.${primaryColumn[primaryTable]} = t2.${primaryColumn[secondaryTable]};
    `;

    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error executing join query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await pool.end();
  }
}

// Export all controller functions
export { getTableData, getDatabaseDetails, insertTableData, joinTableData };

