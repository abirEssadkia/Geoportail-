require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Sketch",
    "esri/widgets/NavigationToggle",
    "esri/widgets/Measurement",
    "esri/widgets/AreaMeasurement2D",
    "esri/widgets/Search",
    "esri/widgets/Legend",
    "esri/widgets/Editor",
    "esri/renderers/SimpleRenderer",
    "esri/renderers/ClassBreaksRenderer",
    "esri/renderers/UniqueValueRenderer"
  ], function (
    esriConfig,
    Map,
    MapView,
    FeatureLayer,
    BasemapGallery,
    Sketch,
    NavigationToggle,
    Measurement,
    AreaMeasurement2D,
    Search,
    Legend,
    Editor,
    SimpleRenderer,
    ClassBreaksRenderer,
    UniqueValueRenderer
  ) {
    esriConfig.apiKey =
      "AAPKb47ae33535834a7da66b82c589f8928dYS-d6Lfs4xufrFG_jE-2yS_y6LSZ7c8X9ZO0LkDxeJpZuwyYqfIaitkKhwMDCMF3";
  
    const map = new Map({
      basemap: "topo-vector"
    });
  
    const view = new MapView({
      map: map,
      container: "viewDiv",
      zoom: 13,
      center: [-7.62, 33.59]
    });
  
    const hotelsLayer = new FeatureLayer({
      url: "https://services6.arcgis.com/qJ9Qb5GMuh5evPYT/arcgis/rest/services/hotels_wgs/FeatureServer/0",
      title: "Hôtels",
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-marker",
          size: 6,
          color: "black",
          outline: {
            width: 0.5,
            color: "white"
          }
        }
      },
      popupTemplate: {
        title: "{NAME}",
        content: "Catégorie: {CATÉGORIE}"
      }
    });
  
    const grandeSurfaceLayer = new FeatureLayer({
      url: "https://services6.arcgis.com/qJ9Qb5GMuh5evPYT/arcgis/rest/services/grande_surface_wgs/FeatureServer/0",
      title: "Grandes Surfaces",
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-marker",
          size: 6,
          color: "green",
          outline: {
            width: 0.5,
            color: "white"
          }
        }
      },
      popupTemplate: {
        title: "{NAME}",
        content: "Type: {Type}"
      }
    });
  
    const communeLayer = new FeatureLayer({
      url: "https://services6.arcgis.com/qJ9Qb5GMuh5evPYT/arcgis/rest/services/commune_wgs/FeatureServer/0",
      title: "Limite Communes de Casablanca"
    });
  
    const voirieLayer = new FeatureLayer({
      url: "https://services6.arcgis.com/qJ9Qb5GMuh5evPYT/arcgis/rest/services/voirie_casa/FeatureServer/0",
      title: "Voirie"
    });
  
    const populationLayer = new FeatureLayer({
      url: "https://services6.arcgis.com/qJ9Qb5GMuh5evPYT/arcgis/rest/services/casa_population1/FeatureServer/0",
      title: "Population de Casablanca"
    });
  
    const centresFormationLayer = new FeatureLayer({
      url: "https://services6.arcgis.com/qJ9Qb5GMuh5evPYT/arcgis/rest/services/sites_projets/FeatureServer/0",
      title: "Centres de Formation Supérieurs"
    });
  
    map.addMany([
      communeLayer,
      voirieLayer,
      populationLayer,
      hotelsLayer,
      grandeSurfaceLayer,
      centresFormationLayer
    ]);
  
    const basemapGallery = new BasemapGallery({
      view: view
    });
    view.ui.add(basemapGallery, "bottom-right");
  
    const navigationToggle = new NavigationToggle({
      view: view
    });
    view.ui.add(navigationToggle, "top-left");
  
    const measurement = new Measurement({
      view: view,
      activeTool: "distance"
    });
    view.ui.add(measurement, "top-right");
  
    const areaMeasurementWidget = new AreaMeasurement2D({
      view: view
    });
    view.ui.add(areaMeasurementWidget, "top-right");
  
    const searchWidget = new Search({
      view: view
    });
    view.ui.add(searchWidget, {
      position: "top-left",
      index: 2
    });
  
    const legend = new Legend({
      view: view
    });
    view.ui.add(legend, "bottom-left");
  
    const editor = new Editor({
      view: view
    });
    view.ui.add(editor, "top-left");
  
    window.setSymbology = function (colonne) {
      communeLayer.renderer = createRenderer(colonne);
    };
  
    function createRenderer(colonne) {
      if (colonne === "Shape_Area") {
        return createClassBreaksRenderer();
      } else if (colonne === "PREFECTURE") {
        return createUniqueValueRenderer("PREFECTURE");
      } else {
        return createUniqueValueRenderer("COMMUNE_AR");
      }
    }
  
    function createUniqueValueRenderer(field) {
      return new UniqueValueRenderer({
        field: field,
        uniqueValueInfos: [
          { value: "PROVINCE DE NOUACEUR", symbol: createSymbol("red") },
          { value: "PROVINCE DE MEDIOUNA", symbol: createSymbol("green") },
          { value: "PREFECTURE DE MOHAMMEDIA", symbol: createSymbol("yellow") },
          { value: "PREFECTURE DE CASABLANCA", symbol: createSymbol("blue") },
          { value: "PROVINCE DE BEN SLIMANE", symbol: createSymbol("grey") }
        ]
      });
    }
  
    function createSymbol(color) {
      return {
        type: "simple-fill",
        color: color,
        outline: {
          color: [0, 0, 0, 0.5],
          width: 0.5
        }
      };
    }
  
    function createClassBreaksRenderer() {
      return new ClassBreaksRenderer({
        field: "Shape_Area",
        classBreakInfos: [
          { minValue: 0, maxValue: 16000000, symbol: createSymbol([255, 255, 212]) },
          { minValue: 16000001, maxValue: 26000000, symbol: createSymbol([254, 196, 79]) },
          { minValue: 26000001, maxValue: 48000000, symbol: createSymbol([254, 153, 41]) },
          { minValue: 48000001, maxValue: 78000000, symbol: createSymbol([217, 95, 14]) },
          { minValue: 78000001, maxValue: 135000000, symbol: createSymbol([153, 52, 4]) }
        ]
      });
    }
  
    window.setSymbologyy = function (colonne) {
      populationLayer.renderer = createPopulationRenderer(colonne);
    };
  
    function createPopulationRenderer(colonne) {
      if (colonne === "TOTAL1994") {
        return createPopulationClassBreaksRenderer("TOTAL1994");
      } else if (colonne === "TOTAL2004") {
        return createPopulationClassBreaksRenderer("TOTAL2004");
      } else {
        return createPopulationClassBreaksRenderer("Shape_Area");
      }
    }
  
    function createPopulationClassBreaksRenderer(field) {
      return new ClassBreaksRenderer({
        field: field,
        classBreakInfos: [
          { minValue: 3365, maxValue: 23322, symbol: createMarkerSymbol("#FFC0CB") },
          { minValue: 23323, maxValue: 52862, symbol: createMarkerSymbol("#1E90FF") },
          { minValue: 52863, maxValue: 122827, symbol: createMarkerSymbol("#800000") },
          { minValue: 122828, maxValue: 218918, symbol: createMarkerSymbol("#808000") },
          { minValue: 218919, maxValue: 323944, symbol: createMarkerSymbol("#FF8C00") }
        ]
      });
    }
  
    function createMarkerSymbol(color) {
      return {
        type: "simple-marker",
        color: color,
        size: 8,
        outline: {
          color: [0, 0, 0, 0.5],
          width: 0.5
        }
      };
    }
  
    const hotelFilterSelect = document.createElement("select");
    const hotelFilterOptions = [
      "-----choisir un hotel selon la catégorie----",
      "CATÉGORIE = '2*'",
      "CATÉGORIE = 'V.V.T 2ème C'",
      "CATÉGORIE = '4*'",
      "CATÉGORIE = '3*'",
      "CATÉGORIE = 'Fermé'",
      "CATÉGORIE = '5*'",
      "CATÉGORIE = 'RT 1ère CAT. (c'",
      "CATÉGORIE = 'CC'",
      "CATÉGORIE = '1*'",
      "CATÉGORIE = '5* luxe'",
      "CATÉGORIE = 'C.C'",
      "CATÉGORIE = 'Maison d'Hôtes'",
      "CATÉGORIE = 'RT 2ème CAT'",
      "CATÉGORIE = 'c conf'",
      "CATÉGORIE = 'P expo'",
      "CATÉGORIE = 'cinema'"
    ];
    hotelFilterOptions.forEach(function (sql) {
      let option = document.createElement("option");
      option.value = sql;
      option.innerHTML = sql;
      hotelFilterSelect.appendChild(option);
    });
  
    hotelFilterSelect.addEventListener("change", function (event) {
      hotelsLayer.definitionExpression = event.target.value;
    });
    view.ui.add(hotelFilterSelect, "top-left");
  
    const surfaceFilterSelect = document.createElement("select");
    const surfaceFilterOptions = [
      "-----choisir les grandes surfaces selon le type----",
      "Type = 'Marjane'",
      "Type = 'Metro'",
      "Type = 'Acima'",
      "Type = 'Grande Surface Spécialisée'",
      "Type = 'LABEL VIE'",
      "Type = 'Twin Center'",
      "Type = 'Marina'"
    ];
    surfaceFilterOptions.forEach(function (sql) {
      let option = document.createElement("option");
      option.value = sql;
      option.innerHTML = sql;
      surfaceFilterSelect.appendChild(option);
    });
  
    surfaceFilterSelect.addEventListener("change", function (event) {
      grandeSurfaceLayer.definitionExpression = event.target.value;
    });
    view.ui.add(surfaceFilterSelect, "top-right");
  });
  