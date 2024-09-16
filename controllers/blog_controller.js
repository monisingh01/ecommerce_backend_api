import blog from "../models/blog_model.js"
import asyncHandler from "express-async-handler"
import validateMongodbId from "../utils/validate_mongodbId.js"


export const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await blog.create(req.body)
        res.json({
            status: "success",
            newBlog,
        })
    }
    catch (error) {
        throw new Error(error)
    }
})


export const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    try {
        const updateBlog = await blog.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json({
            status: true,
            message: "Blog Updated Sucessfully",
            updateBlog,
        })
    }
    catch (error) {
        throw new Error(error)
    }
})


export const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    try {
            // Find the blog by ID and populate likes and dislikes
        const getBlog = await blog.findById(id)
        .populate("likes", "firstname") // Populate likes with user's firstname
        .populate("dislikes", "firstname"); // Populate dislikes with user's firstname
    
        if (!getBlog) {
          return res.status(404).json({ message: "Blog not found" });
        }

            // Increment the number of views
        const updateViews = await blog.findByIdAndUpdate(
            id,
            {
                $inc: { numViews: 1 },
            },
            { new: true },
        )
        .populate("likes", "firstname") // Populate likes with user's firstname
    .populate("dislikes", "firstname"); // Populate dislikes with user's firstname
        res.json(updateViews)
    }
    catch (error) {
        console.log(error.message);
        
        throw new Error(error)
    }
})




export const getAllBlog = asyncHandler(async (req, res) => {
    try {
        const getAll = await blog.find()
        res.json(getAll)
    }
    catch (error) {
        throw new Error(error)
    }
})


export const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    try {
        const deletedBlog = await blog.findByIdAndDelete(id)
        res.json({
            success: true,
            message: "Blog deleted Successfully",
            deletedBlog,
        })
    }
    catch (error) {
        throw new Error(error)
    }
})



export const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body

    // Find the blog that you want to be like
    const blogs = await blog.findById(blogId)
    if (!blogs) {
        return res.status(404).json({
            message: "Blog not found"
        })
    }

    // Find the logged in user
    const loginUserId = req?.user?._id

    // check if the blog is already liked by the user
    const isLiked = blogs?.likes?.includes(loginUserId)

    // check if the blog is dislike by user 
    const alreadyDisliked = blogs?.dislikes?.includes(loginUserId)


    // if the blog is disliked, remove the dislike
    if (alreadyDisliked) {
        await blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        }, {
            new: true
        })
    }


    // If the blog is already liked, remove the like
    if (isLiked) {
        const updateBlog = await blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        }, {
            new: true,
        })
        return res.status(200).json(updateBlog)
    } else {
        // if the blog is not liked and the like
        const updateBlog = await blog.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId },
            isLiked: true,
        }, {
            new: true,
        })
        return res.status(200).json(updateBlog)
    }
})

export const dislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body

    // Find the blog that you want to be disliked
    const blogs = await blog.findById(blogId)
    if (!blogs) {
        return res.status(404).json({
            message: " Blog not found"
        })
    }

    // Find the logged in user
    const loginUserId = req?.user?._id

    // Check if the blogs is already disliked by the user
    const isDisliked = blogs?.dislikes?.includes(loginUserId)

    // Check if the blog is liked by the user
    const alreadyliked = blogs?.likes?.includes(loginUserId)

    // if the blog is liked , remove the like
    if (alreadyliked) {
        await blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            }, {
            new: true
        }
        )
    }

    // if the blog is already disliked, removes the dislike
    if (isDisliked) {
        const updatedBlog = await blog.findByIdAndUpdate(
            blogId,
            {
              $pull: { dislikes: loginUserId },
              isDisliked: false,
            },
            {
              new: true,
            }
          );
          return res.status(200).json(updatedBlog);
        } else {
          // If the blog is not disliked, add the dislike
          const updatedBlog = await blog.findByIdAndUpdate(
            blogId,
            {
              $push: { dislikes: loginUserId },
              isDisliked: true,
            },
            {
              new: true,
            }
          );
          return res.status(200).json(updatedBlog);
        }
      });