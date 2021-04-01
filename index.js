require("dotenv").config();
const debug = require("debug")("mi-app:principal");
const express = require("express");
const chalk = require("chalk");
const { program } = require("commander");
const morgan = require("morgan");
const fetch = require("node-fetch");

program.option("-p, --puerto <puerto>", "Puerto para el servidor");
program.parse(process.argv);
const options = program.opts();

const app = express();

const puerto = 5000;

const server = app.listen(puerto, () => {
  console.log(chalk.yellow(`Servidor escuchando en el puerto ${chalk.green(puerto)}.`));
});

server.on("error", err => {
  debug(chalk.red("Ha ocurrido un error al levantar el servidor"));
  if (err.code === "EADDRINUSE") {
    debug(chalk.red(`El puerto ${puerto} está ocupado`));
  }
});

app.use(morgan("dev"));

app.get("/metro/lineas", (req, res, next) => {
  fetch("https://api.tmb.cat/v1/transit/linies/metro?app_id=a372a6d9&app_key=de3506372e19c90a75a39c1fa2dc9fb7")
    .then(res => res.json())
    .then(lineas => {
      res.json(lineas.features.map(linea => ({
        id: linea.properties.ID_LINIA,
        linea: linea.properties.NOM_LINIA,
        descripcion: linea.properties.DESC_LINIA
      })));
    });
});

app.get("/metro/linea", (req, res, next) => {
  fetch("https://api.tmb.cat/v1/transit/linies/metro?app_id=a372a6d9&app_key=de3506372e19c90a75a39c1fa2dc9fb7")
    .then(res => res.json())
    .then(lineas => {
      res.json(lineas.features.map(linea => ({
        id: linea.properties.ID_LINIA,
        linea: linea.properties.NOM_LINIA,
        descripcion: linea.properties.DESC_LINIA
      })));
    });
});
