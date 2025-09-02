import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Link, useLocation, useNavigate, useParams, } from "react-router-dom";
import "./Category.css";
import AnimatedDropdown from "./AnimatedDropdown";
import PriceFilter from "./PriceFilter";
import namer from "color-namer";


const Category = () => {
  const { id } = useParams();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [brands, setBrands] = React.useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [selectedAges, setSelectedAges] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [ageFilterOpen, setAgeFilterOpen] = useState(false);

  const [materialFilterOpen, setMaterialFilterOpen] = useState(true);

  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  const [filterAttributes, setFilterAttributes] = useState([]);
  const [filterChoices, setFilterChoices] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});

  const [filterColors, setFilterColors] = useState([]);
  const [colorFilterOpen, setColorFilterOpen] = useState(true);
  const [selectedColors, setSelectedColors] = useState([]);

  const [filterValues, setFilterValues] = useState({});


  useEffect(() => {
    if (location?.state?.selectedSubCategories) {
      setSelectedSubCategories(location.state.selectedSubCategories.map(Number));
      navigate(location.pathname, { replace: true, state: null }); // clear state
    } else {
      setSelectedSubCategories([]);
    }
  }, [id]); // run on category id change



  useEffect(() => {
    fetchProducts();
  }, [selectedSubCategories, selectedBrands, selectedColors, filterValues, priceRange]);



  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchFilters();
  }, [id]); // 👈 run again whenever category id changes


  const [mainCategory, setMainCategory] = useState(null);

  const fetchCategories = async () => {
    setLoadingCategory(true); // Start loader
    const fd = new FormData();
    fd.append(
      "authToken",
      localStorage.getItem("authToken") || "Guest"
    );
    fd.append("programType", "getSubAndSubSubCategory");
    fd.append("id", id);

    try {
      const response = await api.post("/ecom/category", fd);

      if (response?.data?.success) {
        setMainCategory(response.data.data.category);
      }
    } catch (error) {
      console.error("Category API Error:", error);
    } finally {
      setLoadingCategory(false); // End loader

    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);

    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "getProductDetails");
    fd.append("category", id);

    if (selectedSubCategories.length > 0) {
      fd.append("sub_category_id", selectedSubCategories.join(","));
    }

    if (selectedBrands.length > 0) {
      fd.append("brand", selectedBrands.join(","));
    }


    if (selectedColors.length > 0) {
      selectedColors.forEach((c) => fd.append("coloratt[]", c));
    }

    // Dynamic attributes like Size, Years etc.
    // ✅ NEW CODE — dynamic key like sizeatt[] or yearatt[]
    Object.entries(selectedFilters).forEach(([attr, { values }]) => {
      if (Array.isArray(values) && values.length > 0) {
        const fieldKey = attr.toLowerCase() + "att[]"; // e.g., "Years" => "yearsatt[]"
        values.forEach((v) => fd.append(fieldKey, v));
      }
    });


    // Price Range
    if (priceRange.min !== null && priceRange.max !== null) {
      fd.append("min", priceRange.min);
      fd.append("max", priceRange.max);
    }


    for (let pair of fd.entries()) {
      console.log(pair[0], pair[1]); // Logs each key-value pair
    }
    try {
      const response = await api.post("/ecom/products", fd);
      console.log("productsssss", response)
      if (response?.data?.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Product API Error:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchBrands = async () => {
    const fd = new FormData();
    fd.append(
      "authToken",
      localStorage.getItem("authToken") || "Guest"
    );
    fd.append("programType", "getBrandDetails");

    try {
      const response = await api.post("/ecom/brand", fd);
      if (response.data?.success) {
        setBrands(response.data.data);
      }
    } catch (error) {
      console.error("Brand API Error:", error);
    }
  };


  const fetchFilters = async () => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "getProductFilters");

    try {
      const response = await api.post("/ecom/products", fd);
      console.log("filter", response)
      if (response.data?.success) {
        const { Attributes, Choices, Colors } = response.data.data;

        setFilterAttributes(Attributes);        // ["Size", "Years"]
        setFilterChoices(Choices);              // { Size: [...], Years: [...] }
        setSelectedFilters({});                 // Reset selected filters

        const namedColors = (Colors || []).map((hex) => {
          const name = namer(hex).ntc[0].name;
          return { hex, name };
        });
        setFilterColors(namedColors);           // Set array of { hex, name }
      }
    } catch (error) {
      console.error("Category API Error:", error);
    }
  };





  React.useEffect(() => {
    fetchBrands();
  }, []);

  const RenderCategories = ({ category, depth = 0 }) => {
    const collapseId = `collapse-${category.id}`;

    return (
      <li data-depth={depth}>
        <span className="custom-checkbox">
          <input
            type="checkbox"
            style={{ margin: "0", padding: "0" }}
            value={category.id}
            checked={selectedSubCategories.includes(Number(category.id))}
            onChange={(e) => {
              const value = Number(e.target.value);
              setSelectedSubCategories((prev) =>
                e.target.checked ? [...prev, value] : prev.filter((id) => id !== value)
              );
            }}
          />

          <span className="ps-shown-by-js">
            <i className="material-icons checkbox-checked">&#xE5CA;</i>
          </span>
        </span>

        <a style={{ marginLeft: "5px" }}>{category.name}</a>

        {category.subCategories && category.subCategories.length > 0 && (
          <>
            <div
              className="navbar-toggler collapse-icons"
              data-toggle="collapse"
              data-target={`#${collapseId}`}
            >
              <i className="material-icons add">&#xE145;</i>
              <i className="material-icons remove">&#xE15B;</i>
            </div>

            <div className="collapse" id={collapseId}>
              <ul className="category-sub-menu">
                {category.subCategories.map((subCat) => (
                  <RenderCategories
                    key={subCat.id}
                    category={subCat}
                    depth={depth + 1}
                  />
                ))}
              </ul>
            </div>
          </>
        )}
      </li>
    );
  };

  return (
    <div>
      <div className="wishlist-header mb-0">
        <div className="container">

          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Categories</span>
          </nav>
        </div>
      </div>
      {/* <!-- -----------Category page------------- --> */}
      <section id="wrapper" style={{ padding: "30px 0px" }}>
        <div class="container">
          <div class="row">
            {/* <!-- ------------------Left-column------------------ -->     */}
            <div
              id="_desktop_left_column"
              class="col-xs-12 col-sm-12 col-md-12 col-lg-3"
            >
              <div id="left-column">
                <div class="category-block-container">
                  <div
                    class="block-title clearfix hidden-lg-up collapsed"
                    data-target="#subcategories-container"
                    data-toggle="collapse"
                  >
                    {loadingCategory ? (
                      <div
                        style={{
                          height: "20px",
                          backgroundColor: "#e0e0e0",
                          borderRadius: "4px",
                          marginBottom: "10px",
                          width: "100%",
                        }}
                      ></div>
                    ) : (
                      mainCategory && (
                        <>


                          {/* Desktop: visible on lg and up only */}
                          <div class="block-title clearfix hidden-lg-up collapsed" data-target="#subcategories-container" data-toggle="collapse" style={{ padding: "0" }}>
                            <span class="h1 products-section-title text-uppercase">

                              <a className="text-uppercase h6">
                                {mainCategory.name}
                              </a>
                            </span>

                          </div>
                        </>
                      )
                    )}



                    <span class="navbar-toggler collapse-icons">
                      <i class="material-icons add">&#xE313;</i>
                      <i class="material-icons remove">&#xE316;</i>
                    </span>
                  </div>
                  {loadingCategory ? (
                    <div
                      style={{
                        height: "40px",
                        backgroundColor: "#e0e0e0",
                        borderRadius: "4px",
                        marginBottom: "10px",
                        width: "100%",
                      }}
                    ></div>
                  ) : (
                    mainCategory && (

                      <h3 class="hidden-md-down">

                        <a className="block-title text-uppercase h6 " >
                          {mainCategory.name}
                        </a>
                      </h3>

                    )
                  )}


                  <div
                    id="subcategories-container"
                    className="block-categories collapse data-toggler"
                  >
                    <ul className="category-top-menu">
                      <li>
                        <ul className="category-sub-menu">
                          {loadingCategory
                            ? Array.from({ length: 3 }).map((_, index) => (
                              <li
                                key={index}
                                style={{ marginBottom: "10px" }}
                              >
                                <div
                                  style={{
                                    height: "14px",
                                    backgroundColor: "#e0e0e0",
                                    borderRadius: "4px",
                                    width: "80%",
                                  }}
                                ></div>
                              </li>
                            ))
                            : mainCategory?.subCategories?.map((subCat) => (
                              <RenderCategories
                                key={subCat.id}
                                category={subCat}
                                depth={0}
                              />
                            ))}
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
                <div id="search_filters_wrapper">
                  <div
                    class="block-title clearfix hidden-lg-up collapsed"
                    data-target="#search_filters"
                    data-toggle="collapse"
                  >
                    <span class="h1 products-section-title text-uppercase">
                      <a class="text-uppercase h6" href="#">
                        Filter
                      </a>
                    </span>
                    <span class="navbar-toggler collapse-icons">
                      <i class="material-icons add">&#xE313;</i>
                      <i class="material-icons remove">&#xE316;</i>
                    </span>
                  </div>
                  <div id="search_filters" class="collapse data-toggler">
                    <h3 class="hidden-md-down">
                      <a class="block-title text-uppercase h6" href="#">
                        Filter
                      </a>
                    </h3>
                    <div
                      id="_desktop_search_filters_clear_all"
                      class="hidden-md-down clear-all-wrapper"
                    >
                      <button
                        data-search-url="#"
                        class="btn btn-tertiary js-search-filters-clear-all"
                      >
                        <i class="material-icons">&#xE14C;</i> Clear all
                      </button>
                    </div>
                    <div class="facet clearfix">
                      <h1 class="h6 facet-title hidden-md-down">Brands</h1>
                      <div
                        class="title hidden-lg-up collapsed"
                        data-target="#facet_71002"
                        data-toggle="collapse"
                      >
                        <h1 class="h6 facet-title">Brands</h1>
                        <span class="float-xs-right">
                          <span class="navbar-toggler collapse-icons">
                            <i class="material-icons add">&#xE313;</i>
                            <i class="material-icons remove">&#xE316;</i>
                          </span>
                        </span>
                      </div>
                      <ul id="facet_71002" className="collapse">
                        {brands.map((brand, index) => (
                          <li key={brand.id}>
                            <label
                              className="facet-label"
                              htmlFor={`facet_input_brand_${index}`}
                            >
                              <span className="custom-checkbox">
                                <input
                                  id={`facet_input_brand_${index}`}
                                  type="checkbox"
                                  value={brand.id}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedBrands((prev) =>
                                      e.target.checked
                                        ? [...prev, value]
                                        : prev.filter((id) => id !== value)
                                    );
                                  }}
                                />

                                <span className="ps-shown-by-js">
                                  <i className="material-icons checkbox-checked">
                                    &#xE5CA;
                                  </i>
                                </span>
                              </span>
                              <a
                                href="#"
                                className="_gray-darker search-link js-search-link"
                                rel="nofollow"
                              >
                                {brand.name}
                              </a>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <PriceFilter onPriceChange={(min, max) => {
                      console.log("Selected price range:", min, max);
                      setPriceRange({ min, max });

                    }} />

                    {/* COLOR FILTER BLOCK */}
                    <div className="facet clearfix">
                      <div
                        className="title"
                        onClick={() => setColorFilterOpen((prev) => !prev)}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <h1 className="h6 facet-title">Color</h1>
                        <span
                          className="navbar-toggler collapse-icons"
                          style={{ marginTop: "-10px", padding: "0" }}
                        >
                          <i className="material-icons">
                            {colorFilterOpen ? "expand_less" : "expand_more"}
                          </i>
                        </span>
                      </div>

                      <AnimatedDropdown isOpen={colorFilterOpen}>
                        {filterColors.map(({ hex, name }, index) => (
                          <li key={index}>
                            <label className="facet-label" htmlFor={`facet_input_color_${index}`}>
                              <span className="custom-checkbox">
                                <input
                                  id={`facet_input_color_${index}`}
                                  type="checkbox"
                                  value={hex} // ✅ Use hex instead of name
                                  checked={selectedColors.includes(hex)}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedColors((prev) =>
                                      e.target.checked
                                        ? [...prev, value]
                                        : prev.filter((c) => c !== value)
                                    );
                                  }}
                                />

                                <span className="ps-shown-by-js">
                                  <i className="material-icons checkbox-checked">&#xE5CA;</i>
                                </span>
                              </span>
                              <span
                                className="color"
                                style={{
                                  backgroundColor: hex,
                                  display: "inline-block",
                                  width: "12px",
                                  height: "12px",
                                  borderRadius: "50%",
                                  marginLeft: "8px",
                                  marginRight: "8px",
                                  border: "1px solid #ccc",
                                }}
                              ></span>
                              <a href="#" className="_gray-darker search-link js-search-link" rel="nofollow">
                                {name}
                              </a>
                            </label>
                          </li>
                        ))}
                      </AnimatedDropdown>
                    </div>

                    {filterAttributes.map((attr, idx) => {
                      const isOpen = selectedFilters[attr]?.open ?? false;
                      const values = filterChoices[attr] || [];

                      return (
                        <div className="facet clearfix" key={idx}>
                          <div
                            className="title"
                            onClick={() =>
                              setSelectedFilters((prev) => ({
                                ...prev,
                                [attr]: { ...(prev[attr] || {}), open: !isOpen },
                              }))
                            }
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <h1 className="h6 facet-title">{attr}</h1>
                            <span
                              className="navbar-toggler collapse-icons"
                              style={{ marginTop: "-10px", padding: "0" }}
                            >
                              <i className="material-icons">{isOpen ? "expand_less" : "expand_more"}</i>
                            </span>
                          </div>

                          <AnimatedDropdown isOpen={isOpen}>
                            {values.map((val, index) => (
                              <li key={index}>
                                <label className="facet-label" htmlFor={`facet_input_${attr}_${index}`}>
                                  <span className="custom-checkbox">
                                    <input
                                      id={`facet_input_${attr}_${index}`}
                                      type="checkbox"
                                      value={val}
                                      checked={(selectedFilters[attr]?.values || []).includes(val)}
                                      onChange={(e) => {
                                        const checked = e.target.checked;
                                        const updatedValues = checked
                                          ? [...(selectedFilters[attr]?.values || []), val]
                                          : (selectedFilters[attr]?.values || []).filter((v) => v !== val);

                                        setSelectedFilters((prev) => ({
                                          ...prev,
                                          [attr]: {
                                            ...(prev[attr] || {}),
                                            values: updatedValues,
                                          },
                                        }));

                                        // ✅ Update only the value-specific state
                                        setFilterValues((prev) => ({
                                          ...prev,
                                          [attr]: updatedValues,
                                        }));
                                      }}

                                    />
                                    <span className="ps-shown-by-js">
                                      <i className="material-icons checkbox-checked">&#xE5CA;</i>
                                    </span>
                                  </span>
                                  <a
                                    href="#"
                                    className="_gray-darker search-link js-search-link"
                                    rel="nofollow"
                                  >
                                    {val}
                                  </a>
                                </label>
                              </li>
                            ))}
                          </AnimatedDropdown>
                        </div>
                      );
                    })}

                    {/* <div className="facet clearfix">

  <div
    className="title"
    onClick={() => setAgeFilterOpen((prev) => !prev)}
    style={{
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <h1 className="h6 facet-title">Age</h1>
    <span className="navbar-toggler collapse-icons"  style={{marginTop:"-10px", padding:"0"}}>
      <i className="material-icons">
        {ageFilterOpen ? "expand_less" : "expand_more"}
      </i>
    </span>
  </div>

 <AnimatedDropdown isOpen={ageFilterOpen}>
      {["0-2", "3-5", "6-10", "11-14"].map((ageRange, index) => (
        <li key={index}>
          <label className="facet-label" htmlFor={`facet_input_age_${index}`}>
            <span className="custom-checkbox">
              <input
                id={`facet_input_age_${index}`}
                type="checkbox"
                value={ageRange}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedAges((prev) =>
                    e.target.checked
                      ? [...prev, value]
                      : prev.filter((a) => a !== value)
                  );
                }}
              />
              <span className="ps-shown-by-js">
                <i className="material-icons checkbox-checked">&#xE5CA;</i>
              </span>
            </span>
            <a
              href="#"
              className="_gray-darker search-link js-search-link"
              rel="nofollow"
            >
              {ageRange}
            </a>
          </label>
        </li>
      ))}
  </AnimatedDropdown>
</div> */}




                    {/* <div className="facet clearfix">
  <div
    className="title"
    onClick={() => setColorFilterOpen((prev) => !prev)}
    style={{
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <h1 className="h6 facet-title">Color</h1>
    <span className="navbar-toggler collapse-icons"  style={{marginTop:"-10px", padding:"0"}}>
      <i className="material-icons">
        {colorFilterOpen ? "expand_less" : "expand_more"}
      </i>
    </span>
  </div>

<AnimatedDropdown isOpen={colorFilterOpen}>
      {[
        { name: "Black", code: "#000000" },
        { name: "White", code: "#ffffff" },
        { name: "Red", code: "#ff0000" },
        { name: "Blue", code: "#0000ff" },
      ].map((color, index) => (
        <li key={index}>
          <label className="facet-label" htmlFor={`facet_input_color_${index}`}>
            <span className="custom-checkbox">
              <input
                id={`facet_input_color_${index}`}
                type="checkbox"
                value={color.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedColors((prev) =>
                    e.target.checked
                      ? [...prev, value]
                      : prev.filter((c) => c !== value)
                  );
                }}
              />
              <span
                className="color"
                style={{
                  backgroundColor: color.code,
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  marginLeft: "8px",
                  marginRight: "8px",
                  border: "1px solid #ccc",
                }}
              ></span>
            </span>
            <a
              href="#"
              className="_gray-darker search-link js-search-link"
              rel="nofollow"
            >
              {color.name}
            </a>
          </label>
        </li>
      ))}
    </AnimatedDropdown>
</div>


<div className="facet clearfix">
  <div
    className="title"
    onClick={() => setMaterialFilterOpen((prev) => !prev)}
    style={{
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <h1 className="h6 facet-title">Material</h1>
    <span className="navbar-toggler collapse-icons" style={{marginTop:"-10px", padding:"0"}}>
      <i className="material-icons">
        {materialFilterOpen ? "expand_less" : "expand_more"}
      </i>
    </span>
  </div>

<AnimatedDropdown isOpen={materialFilterOpen}>
      {["Cotton", "Polyester", "Wool", "Linen"].map((material, index) => (
        <li key={index}>
          <label
            className="facet-label"
            htmlFor={`facet_input_material_${index}`}
          >
            <span className="custom-checkbox">
              <input
                id={`facet_input_material_${index}`}
                type="checkbox"
                value={material}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedMaterials((prev) =>
                    e.target.checked
                      ? [...prev, value]
                      : prev.filter((m) => m !== value)
                  );
                }}
              />
              <span className="ps-shown-by-js">
                <i className="material-icons checkbox-checked">&#xE5CA;</i>
              </span>
            </span>
            <a
              href="#"
              className="_gray-darker search-link js-search-link"
              rel="nofollow"
            >
              {material}
            </a>
          </label>
        </li>
      ))}
    </AnimatedDropdown>
</div> */}





                    {/* <div class="facet clearfix">
                      <h1 class="h6 facet-title hidden-md-down">Size</h1>
                      <div
                        class="title hidden-lg-up collapsed"
                        data-target="#facet_41135"
                        data-toggle="collapse"
                      >
                        <h1 class="h6 facet-title">Size</h1>
                        <span class="float-xs-right">
                          <span class="navbar-toggler collapse-icons">
                            <i class="material-icons add">&#xE313;</i>
                            <i class="material-icons remove">&#xE316;</i>
                          </span>
                        </span>
                      </div>
                      <ul id="facet_41135" class="collapse">
                        <li>
                          <label class="facet-label" for="facet_input_41135_0">
                            <span class="custom-checkbox">
                              <input
                                id="facet_input_41135_0"
                                data-search-url="#"
                                type="checkbox"
                              />
                              <span class="ps-shown-by-js">
                                <i class="material-icons checkbox-checked">
                                  &#xE5CA;
                                </i>
                              </span>
                            </span>
                            <a
                              href="#"
                              class="_gray-darker search-link js-search-link"
                              rel="nofollow"
                            >
                              S<span class="magnitude">(7)</span>
                            </a>
                          </label>
                        </li>
                        <li>
                          <label class="facet-label" for="facet_input_41135_1">
                            <span class="custom-checkbox">
                              <input
                                id="facet_input_41135_1"
                                data-search-url="#"
                                type="checkbox"
                              />
                              <span class="ps-shown-by-js">
                                <i class="material-icons checkbox-checked">
                                  &#xE5CA;
                                </i>
                              </span>
                            </span>
                            <a
                              href="#"
                              class="_gray-darker search-link js-search-link"
                              rel="nofollow"
                            >
                              M<span class="magnitude">(7)</span>
                            </a>
                          </label>
                        </li>
                        <li>
                          <label class="facet-label" for="facet_input_41135_2">
                            <span class="custom-checkbox">
                              <input
                                id="facet_input_41135_2"
                                data-search-url="#"
                                type="checkbox"
                              />
                              <span class="ps-shown-by-js">
                                <i class="material-icons checkbox-checked">
                                  &#xE5CA;
                                </i>
                              </span>
                            </span>
                            <a
                              href="#"
                              class="_gray-darker search-link js-search-link"
                              rel="nofollow"
                            >
                              L<span class="magnitude">(7)</span>
                            </a>
                          </label>
                        </li>
                      </ul>
                    </div> */}
                    {/* <div class="facet clearfix">
                      <h1 class="h6 facet-title hidden-md-down">Color</h1>
                      <div
                        class="title hidden-lg-up collapsed"
                        data-target="#facet_56250"
                        data-toggle="collapse"
                      >
                        <h1 class="h6 facet-title">Color</h1>
                        <span class="float-xs-right">
                          <span class="navbar-toggler collapse-icons">
                            <i class="material-icons add">&#xE313;</i>
                            <i class="material-icons remove">&#xE316;</i>
                          </span>
                        </span>
                      </div>
                      <ul id="facet_56250" class="collapse">
                        <li>
                          <label class="facet-label" for="facet_input_56250_0">
                            <span class="custom-checkbox">
                              <input
                                id="facet_input_56250_0"
                                data-search-url="#"
                                type="checkbox"
                              />
                              <span
                                class="color"
                                style={{ backgroundColor: "#f5f5dc" }}
                              ></span>
                            </span>
                            <a
                              href="#"
                              class="_gray-darker search-link js-search-link"
                              rel="nofollow"
                            >
                              Beige<span class="magnitude">(1)</span>
                            </a>
                          </label>
                        </li>
                        <li>
                          <label class="facet-label" for="facet_input_56250_1">
                            <span class="custom-checkbox">
                              <input
                                id="facet_input_56250_1"
                                data-search-url="#"
                                type="checkbox"
                              />
                              <span
                                class="color"
                                style={{ backgroundColor: "#ffffff" }}
                              ></span>
                            </span>
                            <a
                              href="#"
                              class="_gray-darker search-link js-search-link"
                              rel="nofollow"
                            >
                              White<span class="magnitude">(2)</span>
                            </a>
                          </label>
                        </li>
                        <li>
                          <label class="facet-label" for="facet_input_56250_2">
                            <span class="custom-checkbox">
                              <input
                                id="facet_input_56250_2"
                                data-search-url="#"
                                type="checkbox"
                              />
                              <span
                                class="color"
                                style={{ backgroundColor: "#434A54" }}
                              ></span>
                            </span>
                            <a
                              href="#"
                              class="_gray-darker search-link js-search-link"
                              rel="nofollow"
                            >
                              Black<span class="magnitude">(2)</span>
                            </a>
                          </label>
                        </li>
                        <li>
                          <label class="facet-label" for="facet_input_56250_3">
                            <span class="custom-checkbox">
                              <input
                                id="facet_input_56250_3"
                                data-search-url="#"
                                type="checkbox"
                              />
                              <span
                                class="color"
                                style={{ backgroundColor: "#d19330" }}
                              ></span>
                            </span>
                            <a
                              href="#"
                              class="_gray-darker search-link js-search-link"
                              rel="nofollow"
                            >
                              Orange<span class="magnitude">(3)</span>
                            </a>
                          </label>
                        </li>
                        <li>
                          <label class="facet-label" for="facet_input_56250_4">
                            <span class="custom-checkbox">
                              <input
                                id="facet_input_56250_4"
                                data-search-url="#"
                                type="checkbox"
                              />
                              <span
                                class="color"
                                style={{ backgroundColor: "#5D9CEC" }}
                              ></span>
                            </span>
                            <a
                              href="#"
                              class="_gray-darker search-link js-search-link"
                              rel="nofollow"
                            >
                              Blue<span class="magnitude">(2)</span>
                            </a>
                          </label>
                        </li>
                        <li>
                          <label class="facet-label" for="facet_input_56250_5">
                            <span class="custom-checkbox">
                              <input
                                id="facet_input_56250_5"
                                data-search-url="#"
                                type="checkbox"
                              />
                              <span
                                class="color"
                                style={{ backgroundColor: "#A0D468" }}
                              ></span>
                            </span>
                            <a
                              href="#"
                              class="_gray-darker search-link js-search-link"
                              rel="nofollow"
                            >
                              Green<span class="magnitude">(1)</span>
                            </a>
                          </label>
                        </li>
                      </ul>
                    </div> */}
                    {/* <div class="facet clearfix">
                      <h1 class="h6 facet-title hidden-md-down">
                        Compositions
                      </h1>
                      <div
                        class="title hidden-lg-up collapsed"
                        data-target="#facet_91981"
                        data-toggle="collapse"
                      >
                        <h1 class="h6 facet-title">Compositions</h1>
                        <span class="float-xs-right">
                          <span class="navbar-toggler collapse-icons">
                            <i class="material-icons add">&#xE313;</i>
                            <i class="material-icons remove">&#xE316;</i>
                          </span>
                        </span>
                      </div>
                      <ul id="facet_91981" class="collapse">
                        <li>
                          <label class="facet-label" for="facet_input_91981_0">
                            <span class="custom-checkbox">
                              <input
                                id="facet_input_91981_0"
                                data-search-url="#"
                                type="checkbox"
                              />
                              <span class="ps-shown-by-js">
                                <i class="material-icons checkbox-checked">
                                  &#xE5CA;
                                </i>
                              </span>
                            </span>
                            <a
                              href="#"
                              class="_gray-darker search-link js-search-link"
                              rel="nofollow"
                            >
                              Cotton<span class="magnitude">(3)</span>
                            </a>
                          </label>
                        </li>
                        <li>
                          <label class="facet-label" for="facet_input_91981_1">
                            <span class="custom-checkbox">
                              <input
                                id="facet_input_91981_1"
                                data-search-url="#"
                                type="checkbox"
                              />
                              <span class="ps-shown-by-js">
                                <i class="material-icons checkbox-checked">
                                  &#xE5CA;
                                </i>
                              </span>
                            </span>
                            <a
                              href="#"
                              class="_gray-darker search-link js-search-link"
                              rel="nofollow"
                            >
                              Polyester<span class="magnitude">(2)</span>
                            </a>
                          </label>
                        </li>
                        <li>
                          <label class="facet-label" for="facet_input_91981_2">
                            <span class="custom-checkbox">
                              <input
                                id="facet_input_91981_2"
                                data-search-url="#"
                                type="checkbox"
                              />
                              <span class="ps-shown-by-js">
                                <i class="material-icons checkbox-checked">
                                  &#xE5CA;
                                </i>
                              </span>
                            </span>
                            <a
                              href="#"
                              class="_gray-darker search-link js-search-link"
                              rel="nofollow"
                            >
                              Viscose<span class="magnitude">(2)</span>
                            </a>
                          </label>
                        </li>
                      </ul>
                    </div> */}
                    {/* <div class="facet clearfix">
                      <div class="popular-blog clearfix">
                        <h1 class="h6 facet-title hidden-md-down">
                          Popular Tag
                        </h1>
                        <div
                          class="title hidden-lg-up collapsed"
                          data-target="#facet_91982"
                          data-toggle="collapse"
                        >
                          <h1 class="h6 facet-title">Popular Tag</h1>
                          <span class="float-xs-right">
                            <span class="navbar-toggler collapse-icons">
                              <i class="material-icons add">&#xE313;</i>
                              <i class="material-icons remove">&#xE316;</i>
                            </span>
                          </span>
                        </div>
                        <ul id="facet_91982" class="collapse">
                          <li>
                            <a href="#">Home</a>
                          </li>
                          <li>
                            <a href="#">Top</a>
                          </li>
                          <li>
                            <a href="#">Blouses</a>
                          </li>
                          <li>
                            <a href="#">Dress</a>
                          </li>
                          <li>
                            <a href="#">Outfits</a>
                          </li>
                          <li>
                            <a href="#">Accessories</a>
                          </li>
                          <li>
                            <a href="#">Blog</a>
                          </li>
                        </ul>
                      </div>
                    </div> */}
                  </div>
                </div>
                {/* <section class="featured-products clearfix mt-3">
                  <h3 class="h1 products-section-title block-title hidden-md-down">
                    New products
                  </h3>
                  <div
                    class="block-title clearfix  hidden-lg-up collapsed"
                    data-target="#newproducts-container"
                    data-toggle="collapse"
                  >
                    <span class="products-section-title">New products</span>
                    <span class="navbar-toggler collapse-icons">
                      <i class="material-icons add">&#xE313;</i>
                      <i class="material-icons remove">&#xE316;</i>
                    </span>
                  </div>
                  <div id="newproducts-container" class="collapse data-toggler">
                    <div class="products">
                      <article class="product-miniature js-product-miniature">
                        <div class="product-container">
                          <div class="image">
                            <a href="#" class="thumbnail product-thumbnail">
                              <img
                                src="assets/images/product/1.jpg"
                                alt="Pellentesque et pharetra"
                              />
                            </a>
                          </div>
                          <div class="caption">
                            <div class="product-title">
                              <a href="#">Pellentesque et pharetra</a>
                            </div>
                            <div class="product-price-and-shipping">
                              <span class="sr-only">Regular price</span>
                              <span class="regular-price">$50.00</span>
                              <span class="discount-percentage discount-product">
                                -10%
                              </span>
                              <span class="sr-only">Price</span>
                              <span class="price">$45.00</span>
                            </div>
                          </div>
                        </div>
                      </article>
                      <article class="product-miniature js-product-miniature">
                        <div class="product-container">
                          <div class="image">
                            <a href="#" class="thumbnail product-thumbnail">
                              <img
                                src="assets/images/product/2.jpg"
                                alt="Pellentesque et pharetra"
                              />
                            </a>
                          </div>
                          <div class="caption">
                            <div class="product-title">
                              <a href="#">Vis feugiat delenit</a>
                            </div>
                            <div class="product-price-and-shipping">
                              <span class="sr-only">Regular price</span>
                              <span class="regular-price">$23.00</span>
                              <span class="discount-percentage discount-product">
                                -5%
                              </span>
                              <span class="sr-only">Price</span>
                              <span class="price">$21.85</span>
                            </div>
                          </div>
                        </div>
                      </article>
                      <article class="product-miniature js-product-miniature">
                        <div class="product-container">
                          <div class="image">
                            <a href="#" class="thumbnail product-thumbnail">
                              <img
                                src="assets/images/product/3.jpg"
                                alt="Pellentesque et pharetra"
                              />
                            </a>
                          </div>
                          <div class="caption">
                            <div class="product-title">
                              <a href="#">Curabitur laoret luctus</a>
                            </div>
                            <div class="product-price-and-shipping">
                              <span class="sr-only">Price</span>
                              <span class="price">$50.00</span>
                            </div>
                          </div>
                        </div>
                      </article>
                      <article class="product-miniature js-product-miniature">
                        <div class="product-container">
                          <div class="image">
                            <a href="#" class="thumbnail product-thumbnail">
                              <img
                                src="assets/images/product/4.jpg"
                                alt="Pellentesque et pharetra"
                              />
                            </a>
                          </div>
                          <div class="caption">
                            <div class="product-title">
                              <a href="#">Aliquam fringilla juste</a>
                            </div>
                            <div class="product-price-and-shipping">
                              <span class="sr-only">Price</span>
                              <span class="price">$24.00</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                    <a class="all-product-link h4" href="#">
                      All new products <i class="material-icons">&#xE315;</i>
                    </a>
                  </div>
                </section> */}
                {/* <div id="ishileftbanners" class="clearfix">
                  <div class="image-container">
                    <a class="ishi-customhover-fadeinflip" href="#">
                      <img
                        src="assets/images/leftbanner.jpg"
                        alt="leftbanner1"
                      />
                    </a>
                  </div>
                </div> */}
                {/* <section class="featured-products clearfix mt-3">
                  <h3 class="h1 products-section-title block-title hidden-md-down">
                    Popular Products
                  </h3>
                  <div
                    class="block-title clearfix hidden-lg-up collapsed"
                    data-target="#bestsellers-container"
                    data-toggle="collapse"
                  >
                    <span class="products-section-title">Popular Products</span>
                    <span class="navbar-toggler collapse-icons">
                      <i class="material-icons add">&#xE313;</i>
                      <i class="material-icons remove">&#xE316;</i>
                    </span>
                  </div>
                  <div id="bestsellers-container" class="collapse data-toggler">
                    <div class="products">
                      <article class="product-miniature js-product-miniature">
                        <div class="product-container">
                          <div class="image">
                            <a href="#" class="thumbnail product-thumbnail">
                              <img
                                src="assets/images/product/5.jpg"
                                alt="Pellentesque et pharetra"
                              />
                            </a>
                          </div>
                          <div class="caption">
                            <div class="product-title">
                              <a href="#">Simul dolorem voluptaria</a>
                            </div>
                            <div class="product-price-and-shipping">
                              <span class="sr-only">Price</span>
                              <span class="price">$61.21</span>
                            </div>
                          </div>
                        </div>
                      </article>
                      <article class="product-miniature js-product-miniature">
                        <div class="product-container">
                          <div class="image">
                            <a href="#" class="thumbnail product-thumbnail">
                              <img
                                src="assets/images/product/6.jpg"
                                alt="Pellentesque et pharetra"
                              />
                            </a>
                          </div>
                          <div class="caption">
                            <div class="product-title">
                              <a href="#">Vis feugiat delenit</a>
                            </div>
                            <div class="product-price-and-shipping">
                              <span class="sr-only">Regular price</span>
                              <span class="regular-price">$23.00</span>
                              <span class="discount-percentage discount-product">
                                -5%
                              </span>
                              <span class="sr-only">Price</span>
                              <span class="price">$21.85</span>
                            </div>
                          </div>
                        </div>
                      </article>
                      <article class="product-miniature js-product-miniature">
                        <div class="product-container">
                          <div class="image">
                            <a href="#" class="thumbnail product-thumbnail">
                              <img
                                src="assets/images/product/7.jpg"
                                alt="Pellentesque et pharetra"
                              />
                            </a>
                          </div>
                          <div class="caption">
                            <div class="product-title">
                              <a href="#">Omnis dicam mentitum</a>
                            </div>
                            <div class="product-price-and-shipping">
                              <span class="sr-only">Price</span>
                              <span class="price">$25.99</span>
                            </div>
                          </div>
                        </div>
                      </article>
                      <article class="product-miniature js-product-miniature">
                        <div class="product-container">
                          <div class="image">
                            <a href="#" class="thumbnail product-thumbnail">
                              <img
                                src="assets/images/product/8.jpg"
                                alt="Pellentesque et pharetra"
                              />
                            </a>
                          </div>
                          <div class="caption">
                            <div class="product-title">
                              <a href="#">Vidit dolore eu qui</a>
                            </div>
                            <div class="product-price-and-shipping">
                              <span class="sr-only">Price</span>
                              <span class="price">$30.50</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                    <a class="all-product-link h4" href="#">
                      All best sellers <i class="material-icons">&#xE315;</i>
                    </a>
                  </div>
                </section> */}
              </div>
            </div>

            {/* <!-- ------------------Right-column------------------ -->     */}

            <div
              id="content-wrapper"
              class="col-xs-12 col-sm-12 col-md-12 col-lg-9"
            >
              <section id="main">
                <input
                  id="ishiCartURL"
                  name="ishicarturl"
                  value="#"
                  type="hidden"
                />
                <input
                  id="ishiStaticToken"
                  name="ishistatictoken"
                  value="3d2187fdc78a54510e1e1670c3ff42b0"
                  type="hidden"
                />

                {/* <div class="block-category card card-block">
                  <div class="category-cover">
                    <img
                      src="assets/images/category_img.jpg"
                      alt="category-img"
                    />
                  </div>
                </div> */}


                <div id="category-description">
                  {/* <p>You will find here all woman fashion collections.</p>
                    <p>
                      This category includes all the basics of your wardrobe and
                      much more:
                    </p>
                    <p>
                      shoes, accessories, printed t-shirts, feminine dresses,
                      women's jeans!
                    </p> */}
                </div>

                <section id="products" className="category-product-info">
                  <div id="js-product-list">
                    <div className="products row">
                      {loadingProducts ? (
                        // Skeleton Loader
                        Array.from({ length: 6 }).map((_, index) => (
                          <div
                            key={index}
                            className="product-miniature js-product-miniature col-xs-12 col-sm-6 col-md-4 col-lg-6 col-xl-4"
                          >
                            <div className="product-thumb-skeleton">
                              <div className="skeleton-image"></div>
                              <div className="skeleton-title"></div>
                              <div className="skeleton-rating"></div>
                              <div className="skeleton-price"></div>
                            </div>
                          </div>
                        ))
                      ) : products.length === 0 ? (
                        // No Products Available Message
                        <div className="empty-state">
                          <i className="fas fa-search"></i>
                          <p>No products found</p>
                          <button className="browse-btn" onClick={() => navigate("/home")}>
                            Browse Products
                          </button>
                        </div>
                      ) : (
                        // Product Cards
                        products.map((product) => {
                          const imageArray = JSON.parse(product.images || "[]");
                          const mainImg = product.thumbnail;
                          const hoverImg = imageArray[1]?.image_name;

                          const price = Number(product.unit_price) || 0;
                          const discountValue = Number(product.discount) || 0;
                          const discountType = product.discount_type;

                          let finalPrice = price;
                          let originalPrice = null;

                          if (discountValue > 0) {
                            if (discountType === "percent") {
                              finalPrice = price - (price * discountValue) / 100;
                            } else if (discountType === "flat") {
                              finalPrice = price - discountValue;
                            }
                            originalPrice = price;
                          }

                          return (
                            <article
                              key={product.id}
                              onClick={() => navigate(`/product/${product.id}`)}
                              className="product-miniature js-product-miniature col-xs-12 col-sm-6 col-md-4 col-lg-6 col-xl-4"
                            >
                              <div className="product-thumb">
                                <div className="product-card">
                                  {/* Product Image with Hover */}
                                  <div className="product-image-container">
                                    <img
                                      className="product-image primary"
                                      src={`https://thridle.com/ecom/storage/app/public/product/thumbnail/${mainImg}`}
                                      alt="product-img"
                                    />
                                    <img
                                      className="product-image secondary"
                                      src={
                                        hoverImg
                                          ? `https://thridle.com/ecom/storage/app/public/product/${hoverImg}`
                                          : `https://thridle.com/ecom/storage/app/public/product/thumbnail/${mainImg}`
                                      }
                                      alt="product-hover"
                                    />
                                    {discountValue > 0 && (
                                      <div className="discount-badge">
                                        {discountType === "percent"
                                          ? `${discountValue}% OFF`
                                          : `₹${discountValue} OFF`}
                                      </div>
                                    )}
                                    <button className="quick-view-btn">
                                      <i className="fas fa-eye"></i> Quick View
                                    </button>
                                  </div>

                                  {/* Product Info */}
                                  <div className="product-info">
                                    <h4 className="product-title">{product.name}</h4>
                                    
                            <div className="rating">
                              {[...Array(5)].map((_, i) => (
                                <i className="fas fa-star" key={i}></i>
                              ))}
                              <span className="rating-count">{product.reviewCount || 0}</span>
                            </div>


                                    <div className="price-container">
                                      {originalPrice && (
                                        <span className="original-price">
                                          ₹{originalPrice.toFixed(2)}
                                        </span>
                                      )}
                                      <span className="current-price">
                                        ₹{finalPrice.toFixed(2)}
                                      </span>
                                    </div>


                                  </div>
                                </div>
                              </div>
                            </article>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <style jsx>{`
    .product-thumb {
      padding: 0px;
      cursor: pointer;
      margin-bottom: 20px;
    }

    .product-card {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .product-card:hover {
      transform: translateY(-5px);
    }

    .product-image-container {
      position: relative;
      height: 250px;
      overflow: hidden;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.5s ease;
    }

    .product-image.secondary {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
    }

    .product-image-container:hover .primary {
      opacity: 0;
    }

    .product-image-container:hover .secondary {
      opacity: 1;
    }

    .discount-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: #ff5757;
      color: white;
      padding: 3px 5px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
    }

    .quick-view-btn {
      position: absolute;
      bottom: -40px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.95);
      border: none;
      padding: 8px 15px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      color: #2d3748;
      transition: all 0.3s ease;
      backdrop-filter: blur(5px);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .product-image-container:hover .quick-view-btn {
      bottom: 12px;
    }

    .quick-view-btn:hover {
      background: #48b7ff;
      color: white;
    }

    .product-info {
      padding: 15px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    .product-title {
      font-weight: 600;
      font-size: 16px;
      color: #2d3748;
      margin-bottom: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 40px;
    }

    .rating {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }

    .rating i {
      color: #ffc107;
      font-size: 12px;
      margin-right: 2px;
    }

    .rating-count {
      font-size: 12px;
      color: #718096;
      margin-left: 5px;
    }

    .price-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .original-price {
      text-decoration: line-through;
      color: #a0aec0;
      font-size: 14px;
    }

    .current-price {
      color: #EB4D7F;
      font-weight: 700;
      font-size: 18px;
    }

    .product-actions {
      display: flex;
      gap: 8px;
      margin-top: auto;
    }

    .add-to-cart-btn {
      flex-grow: 1;
      background: #48b7ff;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }

    .add-to-cart-btn:hover {
      background: #0074e4;
    }

    .wishlist-btn {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .wishlist-btn:hover {
      background: #fed7d7;
      border-color: #feb2b2;
      color: #e53e3e;
    }

    /* Skeleton Loader */
    .product-thumb-skeleton {
      padding: 10px;
    }

    .skeleton-image,
    .skeleton-title,
    .skeleton-rating,
    .skeleton-price {
      background: linear-gradient(
        90deg,
        #f0f0f0 25%,
        #e0e0e0 50%,
        #f0f0f0 75%
      );
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
    }

    .skeleton-image {
      height: 250px;
      border-radius: 8px;
      margin-bottom: 15px;
    }

    .skeleton-title {
      height: 20px;
      width: 80%;
      margin-bottom: 10px;
    }

    .skeleton-rating {
      height: 15px;
      width: 60%;
      margin-bottom: 10px;
    }

    .skeleton-price {
      height: 20px;
      width: 40%;
    }

    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #718096;
      width: 100%;
    }

    .empty-state i {
      font-size: 48px;
      margin-bottom: 15px;
      color: #cbd5e0;
    }

    .empty-state p {
      font-size: 18px;
      margin-bottom: 20px;
    }

    .browse-btn {
      background: #48b7ff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .browse-btn:hover {
      background: #0074e4;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .product-image-container {
        height: 200px;
      }

      .product-title {
        font-size: 14px;
      }

      .current-price {
        font-size: 16px;
      }

      .add-to-cart-btn {
        font-size: 12px;
        padding: 6px 10px;
      }
    }
  `}</style>
                </section>

              </section>
            </div>
          </div>
        </div>
      </section>
      <div class="container">
        <div id="_mobile_left_column"></div>
        <div id="_mobile_right_column"></div>
        <div class="clearfix"></div>
      </div>
    </div>
  );
};

export default Category;
