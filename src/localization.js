/*
 * Translated string modules.
 */

import LocalizedStrings from 'localized-strings';
let strings = new LocalizedStrings({
 en:{
   invalid_token: "DatoCMS Site Search Invalid API token: make sure the API token exists and has the proper permissions!",
   empty_search: "Please search something! :)",
   not_found: "No results found for {val} :(",
   total_found: "Total results found: ",
   find_result: "Find results in ",
   placeholder: "What are you looking for?"
 },
 it: {
   invalid_token: "DatoCMS Site Search API token non valido: make sure the API token exists and has the proper permissions!",
   empty_search: "Devi cercare qualcosa! :)",
   not_found: "Nessun risultato trovato per {val} :(",
   total_found: "Totale risultati trovati: ",
   find_result: "Cerca risultati in ",
   placeholder: "Cosa stai cercando?"
 },
 fr: {
   invalid_token: "DatoCMS Site Search API token non valido: make sure the API token exists and has the proper permissions!",
   empty_search: "S'il vous plait chercher quelque chose! :)",
   not_found: "Aucun resultat trouve pour {val} :(",
   total_found: "Total des resultats trouves: ",
   find_result: "Trouver des resultats dans ",
   placeholder: "Que cherchez-vous?"
 },
 es: {
   invalid_token: "DatoCMS Site Search API token non valido: make sure the API token exists and has the proper permissions!",
   empty_search: "Por favor busca algo! :)",
   not_found: "No se encontraron resultados para {val} :(",
   total_found: "Total de resultados encontrados: ",
   find_result: "Encuentra resultados en ",
   placeholder: "Que estas buscando?"
 }
});

module.exports = strings;
