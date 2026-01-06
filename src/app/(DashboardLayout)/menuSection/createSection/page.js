"use client";

import { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export const menuSectionSchema = yup.object({
  name: yup.string().required("Section name is required"),
  description: yup.string(),
  cuisine: yup.string().required("Please select a cuisine"),
  order: yup
    .number()
    .typeError("Order must be a number")
    .min(0, "Order must be >= 0"),
  isActive: yup.boolean(),
});

export default function CreateMenuSecModal({ onClose }) {
  const [cuisines, setCuisines] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(menuSectionSchema),
    defaultValues: {
      isActive: true,
      order: 0,
    },
  });

  // ✅ lock background scroll
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  // ✅ fetch cuisines once
  useEffect(() => {
    const fetchCuisines = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cuisine`);
      const data = await res.json();
      setCuisines(data);
    };
    fetchCuisines();
  }, []);

  const onSubmit = async (formData) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menuSection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    reset();
    onClose(); // ✅ close modal after save
  };

  return (
    <>
      <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Menu Section</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="modal-body">
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">Section Name</label>
                  <input
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    {...register("name")}
                  />
                  <div className="invalid-feedback">
                    {errors.name?.message}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    {...register("description")}
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
                    {cuisines.map((cuisine) => (
                      <option key={cuisine._id} value={cuisine._id}>
                        {cuisine.name}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">
                    {errors.cuisine?.message}
                  </div>
                </div>

                {/* Order */}
                <div className="mb-3">
                  <label className="form-label">Order</label>
                  <input
                    type="number"
                    className={`form-control ${
                      errors.order ? "is-invalid" : ""
                    }`}
                    {...register("order")}
                  />
                  <div className="invalid-feedback">
                    {errors.order?.message}
                  </div>
                </div>

                {/* Active */}
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    {...register("isActive")}
                  />
                  <label className="form-check-label">Active</label>
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
                  {isSubmitting ? "Saving..." : "Save Section"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* backdrop */}
      <div className="modal-backdrop fade show"></div>
    </>
  );
}

