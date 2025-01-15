
exports.getRolesBasedOnOrganization = async (req, res) => {
    const { organizationId } = req.params;
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