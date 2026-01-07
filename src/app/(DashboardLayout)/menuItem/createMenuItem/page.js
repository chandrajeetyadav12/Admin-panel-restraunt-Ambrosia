"use client";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const menuItemSchema = yup.object({
  name: yup.string().required("Item name is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be positive"),

  cuisine: yup.string().required("Please select a cuisine"),
  section: yup.string().required("Please select a section"),

  subcategory: yup.string().nullable(),

  salesCount: yup
    .number()
    .typeError("Sales count must be a number")
    .min(0, "Sales count cannot be negative")
    .default(0),

  image: yup.mixed().required("Image is required"),

  isVeg: yup.boolean(),
  isPopular: yup.boolean(),
});

export default function CreateMenuItemModal({ onClose }) {
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
      salesCount: 0,
    },
  });

  const selectedCuisine = watch("cuisine");

  // 🔒 lock background scroll
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  // Fetch cuisines
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cuisines`)
      .then((res) => res.json())
      .then(setCuisines);
  }, []);

  // Fetch sections by cuisine
  useEffect(() => {
    if (!selectedCuisine) {
      setSections([]);
      return;
    }

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/menuSection/cuisine/${selectedCuisine}`
    )
      .then((res) => res.json())
      .then(setSections);
  }, [selectedCuisine]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "image") {
        formData.append("image", data.image[0]);
      } else {
        formData.append(key, data[key]);
      }
    });

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menuItems`, {
      method: "POST",
      body: formData,
    });

    reset();
    onClose();
  };

  return (
    <>
      {/* MODAL */}
<div
  className="modal fade show d-block"
  tabIndex="-1"
  style={{
    position: "fixed",
    inset: 0,
    zIndex: 9999, //  VERY IMPORTANT
  }}
>
  <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" style={{ height: "calc(100vh - 2rem)" }}>
    <div className="modal-content" style={{ height: "100%" }}>
            <div className="modal-header">
              <h5 className="modal-title">Add Menu Item</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ overflowY: "auto" }}>
              <div className="modal-body" >
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">Item Name</label>
                  <input
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    {...register("name")}
                  />
                </div>

                {/* Price */}
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className={`form-control ${
                      errors.price ? "is-invalid" : ""
                    }`}
                    {...register("price")}
                  />
                </div>

                {/* Cuisine */}
                <div className="mb-3">
                  <label className="form-label">Cuisine</label>
                  <select
                    className={`form-select ${
                      errors.cuisine ? "is-invalid" : ""
                    }`}
                    {...register("cuisine")}
                  >
                    <option value="">Select Cuisine</option>
                    {cuisines.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Section */}
                <div className="mb-3">
                  <label className="form-label">Section</label>
                  <select
                    className={`form-select ${
                      errors.section ? "is-invalid" : ""
                    }`}
                    {...register("section")}
                    disabled={!sections.length}
                  >
                    <option value="">Select Section</option>
                    {sections.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory */}
                <div className="mb-3">
                  <label className="form-label">Subcategory</label>
                  <input
                    className="form-control"
                    {...register("subcategory")}
                    placeholder="Optional"
                  />
                </div>

                {/* Sales Count */}
                <div className="mb-3">
                  <label className="form-label">Sales Count</label>
                  <input
                    type="number"
                    className={`form-control ${
                      errors.salesCount ? "is-invalid" : ""
                    }`}
                    {...register("salesCount")}
                    min={0}
                  />
                </div>

                {/* Image */}
                <div className="mb-3">
                  <label className="form-label">Item Image</label>
                  <input
                    type="file"
                    className={`form-control ${
                      errors.image ? "is-invalid" : ""
                    }`}
                    {...register("image")}
                  />
                </div>

                {/* Checkboxes */}
                <div className="d-flex gap-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      {...register("isVeg")}
                    />
                    <label className="form-check-label">Veg</label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      {...register("isPopular")}
                    />
                    <label className="form-check-label">Popular</label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* BACKDROP */}
      <div
  className="modal-backdrop fade show"
  style={{
    position: "fixed",
    inset: 0,
    zIndex: 9998, //  just below modal
  }}
></div>
    </>
  );
}
