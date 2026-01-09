"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SummaryCards from "@/app/(DashboardLayout)/components/admindashboard/components/SummaryCards";
import CuisineDistribution from "@/app/(DashboardLayout)/components/admindashboard/components/CuisineDistribution";
import SectionItemCount from "@/app/(DashboardLayout)/components/admindashboard/components/SectionItemCount";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [cuisineData, setCuisineData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const summaryRes = await axios.get(`${BASE_URL}/api/admin/dashboard/summary`);
        const cuisineRes = await axios.get(`${BASE_URL}/api/admin/dashboard/cuisine-distribution`);
        const sectionRes = await axios.get(`${BASE_URL}/api/admin/dashboard/section-item-count`);

        setSummary(summaryRes.data);
        setCuisineData(cuisineRes.data);
        setSectionData(sectionRes.data);
        console.log(summaryRes)
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="text-center p-5">Loading dashboard...</div>;
  }

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <h2 className="mb-4 heading">Admin Dashboard</h2>

      <SummaryCards summary={summary} />

      <div className="d-flex flex-wrap gap-4 mt-4">
        <CuisineDistribution data={cuisineData} />
        <SectionItemCount data={sectionData} />
      </div>
    </div>
  );
}
