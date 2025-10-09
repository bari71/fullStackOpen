const totalLikes = (blogs) => {
    return blogs.length === 0 ? 0 : blogs.reduce((total, curBlog) =>  total + curBlog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.length === 0 ? 0 : blogs.reduce((maxLikedBlog, currBlog) => currBlog.likes >= maxLikedBlog.likes ? currBlog : maxLikedBlog, blogs[0])
}

module.exports = {
    totalLikes,
    favoriteBlog,
}