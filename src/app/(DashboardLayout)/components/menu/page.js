"use client";
import { useEffect, useState } from "react";
import axios from "axios";


import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
export default function AdminDashboard() {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    /* ================= STATE ================= */
    const [cuisines, setCuisines] = useState([]);
    const [selectedCuisine, setSelectedCuisine] = useState(null);
    const [menuData, setMenuData] = useState(null);


    const [loading, setLoading] = useState(false);
    const [CuisineLoading, setCuisineLoading] = useState(false);

    const [error, setError] = useState(null);

    /* ================= LOAD CUISINES ================= */
    useEffect(() => {
        const loadCuisines = async () => {
            try {
                setCuisineLoading(true)
                const res = await axios.get(`${BASE_URL}/api/cuisines`);
                setCuisines(res.data);
                if (res.data.length > 0) {
                    handleCuisineSelect(res.data[0]);
                }
            } catch {
                setError("Failed to load cuisines");
            }
            finally {
                setCuisineLoading(false)

            }
        };
        loadCuisines();
    }, []);

    /* ================= LOAD MENU ================= */
    const handleCuisineSelect = async (cuisine) => {
        try {
            setSelectedCuisine(cuisine);
            setLoading(true);
            const res = await axios.get(
                `${BASE_URL}/api/menu/menu-structure/${cuisine._id}`
            );
            setMenuData(res.data);
        } catch {
            setError("Failed to load menu");
        } finally {
            setLoading(false);
        }
    };
    /* ================= UI ================= */
    return (
        <div className="admin-container">
            <h2 className="heading">Menu Management</h2>
              

          

            {error && <p className="error">{error}</p>}

            {/* CUISINES */}

            <div className="">
                {CuisineLoading &&
                    (<Box display="flex" alignItems="center" gap={2}>
                        <Skeleton variant="text" width={300} height={30} />
                        <Typography variant="body2" color="text.secondary">
                            Loading...
                        </Typography>
                    </Box>) }
                <ul className="cuisine-list">
                    {cuisines.map((c) => (
                        <li
                            key={c._id}
                            className={`cuisine-btn ${selectedCuisine?._id === c._id ? "active" : ""
                                }`}
                            onClick={() => handleCuisineSelect(c)}
                        >
                            {c.name}
                        </li>
                    ))}
                </ul>

            </div>

            {loading && (<Box display="flex" alignItems="center" gap={2}>
                <Skeleton variant="text" width={300} height={30} />
                <Typography variant="body2" color="text.secondary">
                    Loading...
                </Typography>
            </Box>)}

            {/* MENU */}
            {menuData &&
                menuData.sections.map((section) => (
                    <div key={section.sectionId}>
                        {/* <h3>{section.sectionName}</h3> */}

                        {Object.entries(section.items).map(([sub, items]) => (
                            <div key={sub}>
                                <h5 className="my-2">{sub}</h5>

                                {items.map((item) => (
                                    <div className="menu-item" key={item._id}>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="menu-img"
                                        />

                                        <div className="menu-info">
                                            <b>{item.name}</b> – ₹{item.price}
                                        </div>
                                     

                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}

         
        </div>
    );
}
