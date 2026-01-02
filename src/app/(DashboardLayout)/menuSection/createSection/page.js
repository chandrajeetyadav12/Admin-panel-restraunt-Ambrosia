"use client";

import { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { menuSectionSchema } from "@/validation/menuSection.schema";
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
export default function CreateMenuSec() {
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

  //  Fetch cuisines ONCE (for select options)
  useEffect(() => {
    const fetchCuisines = async () => {
      const res = await fetch("http://localhost:5000/api/cuisine");
      const data = await res.json();
      console.log(data)
      setCuisines(data);
    };

    fetchCuisines();
  }, []);

  //  Submit menu section
  const onSubmit = async (formData) => {
    console.log(formData)
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menuSection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    reset();
    alert("Menu section created successfully");
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Create Menu Section</h3>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

        {/* Cuisine Select */}
        <div className="mb-3">
          <label className="form-label">Cuisine</label>
          <select
            className={`form-select ${errors.cuisine ? "is-invalid" : ""}`}
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
            className={`form-control ${errors.order ? "is-invalid" : ""}`}
            {...register("order")}
          />
          <div className="invalid-feedback">
            {errors.order?.message}
          </div>
        </div>

        {/* Active */}
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            {...register("isActive")}
            defaultChecked
          />
          <label className="form-check-label">Active</label>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Create Section"}
        </button>
      </form>
    </div>
  );
}
