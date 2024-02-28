import { useEffect, useState } from "react";
import loader from "./assets/loader.svg";
import browser from "./assets/browser.svg";
import "./App.css";

// Récupération de la clé API depuis les variables d'environnement
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function App() {
  // État local pour stocker les données météorologiques
  const [weatherData, setWeatherData] = useState(null);
  // état pour gérer les erreurs
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    fetch(`http://api.airvisual.com/v2/nearest_city?key=${API_KEY}`)
      // Utilisation de la méthode .then pour gérer la réponse de l'API
      .then((response) => {
        console.log(response);
        // 400 - 499 : Erreur client
        // 500 - 599 : Erreur serveur

        // Utilisation de la méthode .json() pour extraire le corps de la réponse au format JSON
        return response.json();
      })
      .then((responseData) => {
        // Formatage des données reçues avant de les stocker dans l'état local
        setWeatherData({
          city: responseData.data.city,
          country: responseData.data.country,
          iconId: responseData.data.current.weather.ic,
          temperature: responseData.data.current.weather.tp,
        });
      })
      .catch((err) => {
        // Gestion des erreurs en cas d'échec de la requête
        console.error(err);
        setErrorInfo(err.message);
      });
  }, [API_KEY]); // Ajout de API_KEY dans les dépendances du useEffect

  return (
    <main>
      {/* chargement  */}
      <div className={`loader-container ${(!weatherData && !errorInfo) && "active"}`}>
        <img src={loader} alt="loading icon" />
      </div>
      {/* exécution si les données sont arrivées  */}
      {weatherData && (
        <>
          <p className="city-name">{weatherData.city}</p>
          <p className="country-name">{weatherData.country}</p>
          <p className="temperature">{weatherData.temperature}°</p>
          <div className="info-icon-container">
            <img
              src={`/icons/${weatherData.iconId}.svg`}
              className="info-icon"
              alt="Weather icon"
            />
          </div>
        </>
      )}
      {/* Affichage de l'erreur si elle est présente et si les données ne sont pas disponibles */}
      {errorInfo && !weatherData && (
        <>
          <p className="error-information">{errorInfo}</p>
          <img src={browser} alt="error icon" />
        </>
      )}
    </main>
  );
}

export default App;
