"use client";
import { useEffect, useState } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function MenuSectionsPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [cuisines, setCuisines] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [sections, setSections] = useState([]);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  //  Fetch ALL cuisines
  useEffect(() => {
    axios
      .get(`${API}/api/cuisines`)
      .then((res) => setCuisines(res.data))
      .catch((err) => console.error(err));
  }, []);

  //  Fetch sections when cuisine selected
  useEffect(() => {
    if (!selectedCuisine) return;

    axios
      .get(`${API}/api/menuSection/cuisine/${selectedCuisine}`)
      .then((res) => setSections(res.data))
      .catch((err) => console.error(err));
  }, [selectedCuisine]);

  //  Open edit modal
  const handleEdit = (section) => {
    setEditingId(section._id);
    setFormData({ name: section.name });
    setOpen(true);
  };

  // Update menu section
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${API}/api/menuSection/${editingId}`,
        formData
      );

      setSections((prev) =>
        prev.map((s) => (s._id === editingId ? res.data : s))
      );

      setOpen(false);
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  //  Delete menu section
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this menu section?")) return;

    try {
      await axios.delete(`${API}/api/menuSection/${id}`);
      setSections((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        Menu Sections
      </Typography>

      {/* Cuisine Dropdown */}
      <Select
        value={selectedCuisine}
        onChange={(e) => setSelectedCuisine(e.target.value)}
        displayEmpty
        sx={{ mb: 2, minWidth: 300 }}
      >
        <MenuItem value="">Select Cuisine</MenuItem>
        {cuisines.map((cuisine) => (
          <MenuItem key={cuisine._id} value={cuisine._id}>
            {cuisine.name}
          </MenuItem>
        ))}
      </Select>

      {/* Sections List */}
      {sections.map((section) => (
        <Box
          key={section._id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
            padding: "10px",
            maxWidth: 500,
          }}
        >
          <Typography>{section.name}</Typography>

          <Box>
            <IconButton
              color="success"
              onClick={() => handleEdit(section)}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              color="error"
              onClick={() => handleDelete(section._id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      ))}

      {/* Edit Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" mb={2}>
            Edit Menu Section
          </Typography>

          <TextField
            fullWidth
            label="Section Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ name: e.target.value })
            }
          />

          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button sx={{backgroundColor:"#e66f15",color:"#fff"}} onClick={() => setOpen(false)}>Cancel</Button>
            <Button sx={{backgroundColor:"#e66f15",color:"#fff"}} onClick={handleUpdate}>
              Update
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
