const generarReporte = (req, res, next) => {
    console.log(`Consulta realizada a la ruta: ${req.originalUrl}`);
    next();
  };
  
  module.exports = { generarReporte };
  