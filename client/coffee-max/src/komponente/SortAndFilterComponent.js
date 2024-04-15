import React from "react";

const SortAndFilterComponent = ({ products, onSortChange, onFilterChange }) => {
  if (!products) {
    return null;
  }

  const allTypes = [];
  const allVarieties = [];

  const productTypes = products.map((product) => product.Tip_kafe.split(", "));
  const productVarieties = products.map((product) =>
    product.Vrsta_kafe.split(", ")
  );
  const flattenedTypes = [].concat(...productTypes);
  const flattenedVarieties = [].concat(...productVarieties);

  const uniqueTypes = [...new Set(flattenedTypes)];
  const uniqueVarieties = [...new Set(flattenedVarieties)];

  return (
    <div>
      <select onChange={(e) => onSortChange(e.target.value)}>
        <option value="priceLowToHigh">Price: Low to High</option>
        <option value="priceHighToLow">Price: High to Low</option>
      </select>
      <div>
      {
  uniqueTypes.map((type) => (
    <label key={type}>
      <input
        type="checkbox"
        onChange={(e) => onFilterChange("type", type)}
      />
      {type}
    </label>
  ))
}
{
  uniqueVarieties.map((variety) => (
    <label key={variety}>
      <input
        type="checkbox"
        onChange={(e) => onFilterChange("variety", variety)}
      />
      {variety}
    </label>
  ))
}
      </div>
    </div>
  );
};

export default SortAndFilterComponent;
