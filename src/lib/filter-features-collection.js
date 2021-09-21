export default(featuresCollection, waterBodies, waterBody) => {
  let filteredFeatures = []
  if (waterBody) {
    filteredFeatures = featuresCollection.features.filter(
      (feature) => feature.properties.locationId === waterBody,
    )}else{
    filteredFeatures = featuresCollection.features.filter((feature) =>
    waterBodies.includes(feature.properties.locationId),
  )}
  
  const filteredFeaturesCollection = {
    ...featuresCollection,
    features: filteredFeatures,
  }

  return filteredFeaturesCollection

}