"use client";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
export const menuItemSchema = yup.object({
  name: yup.string().required("Item name is required"),
  description: yup.string(),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be positive"),

  cuisine: yup.string().required("Please select a cuisine"),
  section: yup.string().required("Please select a section"),

  subcategory: yup.string().nullable(),
  image: yup
    .mixed()
    .required("Image is required")
    .test("fileSize", "Image is too large (max 2MB)", (value) => {
      return value && value[0] && value[0].size <= 2 * 1024 * 1024;
    })
    .test("fileType", "Only JPG, PNG, WEBP allowed", (value) => {
      return (
        value &&
        value[0] &&
        ["image/jpeg", "image/png", "image/webp"].includes(value[0].type)
      );
    }),
  salesCount: yup
    .number()
    .typeError("Sales count must be a number")
    .min(0, "Sales count cannot be negative")
    .default(0),
  isVeg: yup.boolean(),
  isPopular: yup.boolean(),
});
export default function CreateMenuItem() {
  const [cuisines, setCuisines] = useState([]);
  const [sections, setSections] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(menuItemSchema),
    defaultValues: {
      isVeg: true,
      isPopular: false,
    },
  });

  const selectedCuisine = watch("cuisine");

  //  Fetch cuisines
  useEffect(() => {
    const fetchCuisines = async () => {
      const res = await fetch("http://localhost:5000/api/Cuisine");
      const result = await res.json();
      // console.log(result)
      setCuisines(result);
    };
    fetchCuisines();
  }, []);

  //  Fetch sections when cuisine changes
  useEffect(() => {
    if (!selectedCuisine) {
      setSections([]);
      return;
    }

    const fetchSections = async () => {
      const res = await fetch(
        `http://localhost:5000/api/menuSection/cuisine/${selectedCuisine}`
      );
      const result = await res.json();
      console.log(result)
      setSections(result);
    };

    fetchSections();
  }, [selectedCuisine]);

  //  Submit menu item
const onSubmit = async (data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (key === "image") {
      formData.append("image", data.image[0]); // FILE
    } else {
      formData.append(key, data[key]);
    }
  });

  await fetch("http://localhost:5000/api/menuItems", {
    method: "POST",
    body: formData,
  });

  reset();
  alert("Menu item created successfully");
};


  return (
    <div className="container mt-5">
      <h3>Create Menu Item</h3>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Name */}
        <div className="mb-3">
          <label className="form-label">Item Name</label>
          <input
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            {...register("name")}
          />
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>

        {/* Price */}
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className={`form-control ${errors.price ? "is-invalid" : ""}`}
            {...register("price")}
          />
          <div className="invalid-feedback">{errors.price?.message}</div>
        </div>

        {/* Cuisine */}
        <div className="mb-3">
          <label className="form-label">Cuisine</label>
          <select
            className={`form-select ${errors.cuisine ? "is-invalid" : ""}`}
            {...register("cuisine")}
            defaultValue=""
          >
            <option value="">Select Cuisine</option>
            {cuisines.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">{errors.cuisine?.message}</div>
        </div>

        {/* Section */}
        <div className="mb-3">
          <label className="form-label">Section</label>
          <select
            className={`form-select ${errors.section ? "is-invalid" : ""}`}
            {...register("section")}
            defaultValue=""
            disabled={!sections.length}
          >
            <option value="">Select Section</option>
            {sections.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">{errors.section?.message}</div>
        </div>

        {/* Subcategory */}
        <div className="mb-3">
          <label className="form-label">Subcategory</label>
          <input className="form-control" {...register("subcategory")} />
        </div>
        <div className="mb-3">
          <label className="form-label">Item Image</label>
          <input
            type="file"
            className={`form-control ${errors.image ? "is-invalid" : ""}`}
            {...register("image")}
            accept="image/*"
          />
          <div className="invalid-feedback">
            {errors.image?.message}
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Sales Count</label>
          <input
            type="number"
            className={`form-control ${errors.salesCount ? "is-invalid" : ""}`}
            {...register("salesCount")}
            defaultValue={0}
            min={0}
          />
          <div className="invalid-feedback">
            {errors.salesCount?.message}
          </div>
        </div>

        {/* Veg */}
        <div className="form-check mb-2">
          <input
            type="checkbox"
            className="form-check-input"
            {...register("isVeg")}
            defaultChecked
          />
          <label className="form-check-label">Veg</label>
        </div>

        {/* Popular */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            {...register("isPopular")}
          />
          <label className="form-check-label">Popular</label>
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Create Item"}
        </button>
      </form>
    </div>
  );
}
