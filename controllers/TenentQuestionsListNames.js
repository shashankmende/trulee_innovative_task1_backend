const QuestionbankFavList = require("../models/questionbankFavList");

const createList = async (req, res) => {
    const { label, ownerId, tenantId, name } = req.body;
  
    try {
      const newList = await QuestionbankFavList.create({
        label,
        ownerId,
        tenantId: tenantId || null,
        name,
      });
      res.status(201).json(newList);
    } catch (error) {
      console.error('Error creating list:', error);
      res.status(500).json({ error: 'Error creating list' });
    }
  }

const  getList  = async (req, res) => {
    const { userId } = req.params;
    console.log('Fetching lists for userId:', userId);
  
    try {
      const lists = await QuestionbankFavList.find({ ownerId: userId });
      res.status(200).json(lists);
    } catch (error) {
      console.error('Error fetching lists:', error);
      res.status(500).json({ error: 'Error fetching lists' });
    }
  }


const updateList =  async (req, res) => {
    const { id } = req.params;
    const { label, name } = req.body;  // Accept both label and name
  
    try {
      const updatedList = await QuestionbankFavList.findByIdAndUpdate(
        id,
        { label, name },  // Update both label and name fields
        { new: true }
      );
      if (!updatedList) {
        return res.status(404).json({ message: "List not found." });
      }
      res.status(200).json(updatedList);
    } catch (error) {
      console.error('Error updating list:', error);
      res.status(500).json({ error: 'Error updating list', message: error.message });
    }
  }

module.exports = {createList,getList,updateList}