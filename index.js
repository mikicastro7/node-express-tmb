require("dotenv").config();
const express = require("express");
const chalk = require("chalk");
const morgan = require("morgan");
const fetch = require("node-fetch");

const app = express();

const server = app.listen(5000, () => {
  console.log(chalk.yellow("Servidor escuchando en el puerto 5000."));
});

app.use(morgan("dev"));

app.use((req, res, next) => {
  const metodosNoAceptados = ["POST", "PUT", "DELETE"];
  if (metodosNoAceptados.includes(req.method)) {
    res.status(403).json({ error: true, mensaje: "Te pensabas que podías hackerme" });
  }
});

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

app.get("/metro/linea/:nombre", (req, res, next) => {
  const { nombre } = req.params;
  fetch(`https://api.tmb.cat/v1/transit/linies/metro?filter=NOM_LINIA='${nombre}'&app_id=a372a6d9&app_key=de3506372e19c90a75a39c1fa2dc9fb7`)
    .then(res => res.json())
    .then(linea => {
      if (linea.numberMatched === 0) {
        res.status(404).json({ error: true, mensaje: "Recurso no encontrado" });
      } else {
        const { CODI_LINIA, NOM_LINIA, DESC_LINIA } = linea.features[0].properties;
        fetch(`https://api.tmb.cat/v1/transit/linies/metro/${CODI_LINIA}/estacions?app_id=a372a6d9&app_key=de3506372e19c90a75a39c1fa2dc9fb7`)
          .then(res => res.json())
          .then(paradasResp => {
            res.json(
              {
                linea: NOM_LINIA,
                desc: DESC_LINIA,
                paradas: paradasResp.features.map(parada => ({
                  id: parada.properties.ID_ESTACIO,
                  nombre: parada.properties.NOM_ESTACIO
                }))
              }
            );
          });
      }
    });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: true, mensaje: "Error general" });
});
