import { useMediaQuery, Box, Drawer } from "@mui/material";
import SidebarItems from "./SidebarItems";



interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
}

const MSidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
}: ItemType) => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));

  const sidebarWidth = "270px";

  // Custom CSS for short scrollbar
  const scrollbarStyles = {
    '&::-webkit-scrollbar': {
      width: '7px',

    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#111',
      borderRadius: '15px',
    },
  };


  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
        }}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar for desktop */}
        {/* ------------------------------------------- */}
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          variant="permanent"
          slotProps={{
            paper: {
              sx: {
                boxSizing: "border-box",
                backgroundColor: "#111",
                color: "#fff",
                ...scrollbarStyles,
                width: sidebarWidth,
              },
            }
          }}
        >
          {/* ------------------------------------------- */}
          {/* Sidebar Box */}
          {/* ------------------------------------------- */}
          <Box
            sx={{
              height: "100%",
              backgroundColor: "#111"

            }}
          >

            <Box>
              {/* ------------------------------------------- */}
              {/* Sidebar Items */}
              {/* ------------------------------------------- */}
              <SidebarItems />
            </Box>
          </Box>
        </Drawer>
      </Box >
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"

      slotProps={{
        paper: {
          sx: {
            boxShadow: (theme) => theme.shadows[8],
            ...scrollbarStyles,
            backgroundColor: "#111",
            color: "#fff",
          },
        }
      }}
    >
      {/* ------------------------------------------- */}
      {/* Sidebar Box */}
      {/* ------------------------------------------- */}
      <Box>
        {/* ------------------------------------------- */}
        {/* Sidebar Items */}
        {/* ------------------------------------------- */}
        <SidebarItems />
      </Box>
      {/* ------------------------------------------- */}
      {/* Sidebar For Mobile */}

      {/* ------------------------------------------- */}
    </Drawer>
  );
};

export default MSidebar;





