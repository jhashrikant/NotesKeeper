const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Notes = require('../models/Notes');
const fetchuser = require('../Middleware/fetchuser');

//below kaisa hai ki app.use('/api/auth',require('./routes/auth')); ye jo hai isme 
//diya hai ki if api/auth hoaga to below function run kro below api
//iseme ye hai ki api/auth ke bad kuch bi url ayga wo idr below api run  karvayfa
//below ye kisamko api/auth aise chode d to below run hoaga function usme dekho sirf / hai


//Get all Notes using GET
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

});


//ROUTE 2 : ADD A NEW NOTE USING POST api/notes/addnote  = login rewuired for this 

router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 characters long').isLength({ min: 5 }),
],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            //doing array destructuring to get the info from req.body
            const { title, description } = req.body;
            //getting new notes from the user
            const note = new Notes({
                title, description, user: req.user.id
            })
            const savedNotes = await note.save();
            res.json(savedNotes);

        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
    });


//ROUTE 3 : UPDATE A existing NOTE USING POST api/notes/updatenote  = login rewuired for this 

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description } = req.body;

    //create a new note
    try {
        const newNote = {};
        //if title hai then newnote me title add kro naya wqla update jo daala user ne 
        if (title) {
            { newNote.title = title };
        }
        if (description) {
            { newNote.description = description };
        }

        // if (tag) {
        //     { newNote.tag = tag };
        // }
        //find the note to be updated and update it
        //hum yaha particular id dhund the bande ka(mtlb id se hum uska notes dhudndke upate kreg) jisko update krne hai notes apna
        let note = await Notes.findById(req.params.id);//iss id se hume document miljayga jisko update krnahai id se mllb user milta
        if (!note) {
            return res.status(404).send("not Found");
        }
        //agr notes nai mila then above
        //check krege ki ye jiska notes hai wo user and loggedn in user same hai ki nai
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

});



//ROUTE 4 : DELETE A existing NOTE USING DELETE api/notes/deletenote  = login rewuired for this 

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    
    try {
        //find the note to be deleted and delete it
        //hum yaha particular id dhund the bande ka(mtlb id se hum uska notes dhudndke delete kreg) jisko deleete krne hai notes apna
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("not Found")
        }
        //agr notes nai mila then above
        //check krege ki ye jiska notes hai wo user and loggedn in user same hai ki nai
        //allow deletion only if the user owns this notes
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Your notes has been deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

});

module.exports = router;