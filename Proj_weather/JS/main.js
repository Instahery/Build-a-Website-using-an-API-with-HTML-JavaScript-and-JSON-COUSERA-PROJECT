document.addEventListener("DOMContentLoaded", function () {
    const Combokota = document.getElementById("Combokota");
    const weatherContainer = document.getElementById("weatherContainer");

    // Add a default "Select a city" option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a city";
    Combokota.appendChild(defaultOption);

    // Fetch city coordinates from the CSV file
    fetch("city_coordinates.csv")
        .then((response) => response.text())
        .then((csvData) => {
            // Parse CSV data
            const rows = csvData.split("\n").slice(1);
            const cities = rows.map((row) => {
                const [latitude, longitude, city, country] = row.split(",");
                return { latitude, longitude, city, country };
            });

            // Populate the city dropdown with options
            cities.forEach((city) => {
                const option = document.createElement("option");
                option.value = `${city.latitude},${city.longitude}`;
                option.textContent = `${city.city}, ${city.country}`;
                Combokota.appendChild(option);
            });
        })
        .catch((error) => {
            console.error("Error fetching city coordinates:", error);
        });

    // Fetch weather data when a city is selected       https://github.com/Yeqzids/7timer-issues/wiki/Wiki
    Combokota.addEventListener("change", function () {
        // Check if a valid city is selected
        if (Combokota.value) {
            const selectedCoordinates = Combokota.value.split(",");
            const apiUrl = `https://www.7timer.info/bin/api.pl?lon=${selectedCoordinates[1]}&lat=${selectedCoordinates[0]}&product=civillight&output=xml`;

            fetch(apiUrl)
                .then((response) => response.text())
                .then((xmlData) => {
                    // Parse and display weather data
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlData, "text/xml");

                    // Clear previous content
                    weatherContainer.innerHTML = "";

                    // Loop through each data element in the XML
                    const dataElements = xmlDoc.querySelectorAll("data");
                    for (let i = 0; i <1; i++) {
                        const dayData = dataElements[i];
                        const forecastItem = document.createElement("div");
                        forecastItem.classList.add("forecast-item");
                        const weatherImage = document.createElement("img");
                      weatherImage.src = `https://www.7timer.info/bin/civillight.php?lon=${selectedCoordinates[1]}&lat=${selectedCoordinates[0]}&lang=en&ac=0&unit=metric&output=internal&tzshift=0`;
//"https://www.7timer.info/bin/civillight.php?lon=120&lat=-5&lang=en&ac=0&unit=metric&output=internal&tzshift=0"

                        // Append image,  to the forecast item
                    //    forecastItem.appendChild(dayInfoParagraph);
                       forecastItem.appendChild(weatherImage);
                     //  forecastItem.appendChild(tempParagraph);

                        // Append the forecast item to the weather container
                        weatherContainer.appendChild(forecastItem);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching weather data:", error);
                });
        }
    });


});