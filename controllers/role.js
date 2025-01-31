// const RolesData = require("../models/RolesData");

// const Role = require("../models/ro")

// exports.getRolesBasedOnOrganization = async (req, res) => {
//     const { organizationId } = req.params;
//     try {
//       const roles = await RolesData.find({ organizationId }).populate('reportsToRoleId');
//       if (!roles || roles.length === 0) {
//         return res.status(404).json({ message: 'No roles found for this organization' });
//       }
//       res.status(200).json(roles);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching roles', error: error.message });
//     }
//   }


  exports.getRoleBasedOnId = async (req, res) => {
    try {
      const { id } = req.params;
      const role = await Role.findById(id);
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }
      res.json(role);
    } catch (error) {
      console.error('Error fetching role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }


exports.getRolesDataBasedonId =  async (req, res) => {
    const { id } = req.params;
    try {
      const role = await Role.findById(id);
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }
      res.status(200).json(role);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching role', error: error.message });
    }
  }


exports.getRolesDataBasedOnOrganization =  async (req, res) => {
    const { organizationId } = req.query; // Use query parameters
    try {
      const roles = await Role.find({ organizationId }).populate('reportsToRoleId');
      if (!roles || roles.length === 0) {
        return res.status(404).json({ message: 'No roles found for this organization' });
      }
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching roles', error: error.message });
    }
  }