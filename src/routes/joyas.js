const express = require('express');
const router = express.Router();
const pool = require('../db');
const { generarReporte } = require('../middlewares/reporte');

// Middleware para generar reportes
router.use(generarReporte);

// Ruta GET /joyas con paginación, ordenamiento y HATEOAS
router.get('/', async (req, res) => {
  try {
    const { limits = 10, page = 1, order_by = 'id_ASC' } = req.query;
    const [field, direction] = order_by.split('_');
    const offset = (page - 1) * limits;
    const result = await pool.query(`SELECT * FROM inventario ORDER BY ${field} ${direction.toUpperCase()} LIMIT $1 OFFSET $2`, [limits, offset]);

    const joyas = result.rows;
    const totalItems = (await pool.query('SELECT COUNT(*) FROM inventario')).rows[0].count;
    const totalPages = Math.ceil(totalItems / limits);

    res.json({
      data: joyas,
      _links: {
        self: `/joyas?limits=${limits}&page=${page}&order_by=${order_by}`,
        next: `/joyas?limits=${limits}&page=${Number(page) + 1}&order_by=${order_by}`,
        prev: `/joyas?limits=${limits}&page=${Number(page) - 1}&order_by=${order_by}`,
      },
      totalItems,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta GET /joyas/filtros
router.get('/filtros', async (req, res) => {
  try {
    const { precio_min, precio_max, categoria, metal } = req.query;
    let query = 'SELECT * FROM inventario WHERE 1=1';
    const values = [];
    if (precio_min) {
      values.push(precio_min);
      query += ` AND precio >= $${values.length}`;
    }
    if (precio_max) {
      values.push(precio_max);
      query += ` AND precio <= $${values.length}`;
    }
    if (categoria) {
      values.push(categoria);
      query += ` AND categoria = $${values.length}`;
    }
    if (metal) {
      values.push(metal);
      query += ` AND metal = $${values.length}`;
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
