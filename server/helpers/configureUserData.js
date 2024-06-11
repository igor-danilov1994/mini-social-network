const configureUserData = (userData) => {
    return {
        email: userData.email,
        name: userData.name,
        avatarUrl: userData.avatarUrl,
        posts: userData.posts,
        likes: userData.likes,
        id: userData._id,
        bio: userData.bio,
        location: userData.location,
        comments: userData.comments,
        followers: userData.followers,
        following: userData.following,
        dateOfBirth: userData.dateOfBirth,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
    }
}

module.exports = configureUserData
