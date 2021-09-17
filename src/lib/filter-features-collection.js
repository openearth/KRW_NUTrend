export default(featuresCollection, waterBodies) => {
 
  const filteredFeatures = featuresCollection.features.filter((feature) =>
    waterBodies.includes(feature.properties.locationId),
  )
  const filteredFeaturesCollection = { ...featuresCollection, features: filteredFeatures }

  return filteredFeaturesCollection

}