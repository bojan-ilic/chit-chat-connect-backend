/**
 * Pre-defined stages for enriching data by joining related collections in MongoDB aggregation pipelines.
 * Used to combine user, post, comment, like, and message data, ensuring consistency and maintainability.
 */

// Joining 'users' collection to 'posts' based on 'userId'
export const joinPostUser = [
	{
		// Performing a lookup to join the current collection with the 'users' collection
		$lookup: {
			from: 'users', // Target collection to join
			localField: 'userId', // Field in the 'posts' collection
			foreignField: '_id', // Field in the 'users' collection
			as: 'user', // Output field
			pipeline: [
				// Additional aggregation pipeline
				{
					// Projects or includes specific fields from the joined 'users' collection into the resulting output
					$project: {
						// Includes the 'firstName' field from the 'users' collection
						firstName: 1,
						// Includes the 'lastName' field from the 'users' collection
						lastName: 1
					}
				}
			]
		}
	},
	// Deconstructing the 'user' array created by the $lookup stage
	{$unwind: '$user'}
];

// Joining 'posts' collection to 'comments' based on 'postId'
export const joinPostComment = [
	{
		$lookup: {
			from: 'posts', // Target collection to join
			localField: 'postId', // Field in the 'comments' collection
			foreignField: '_id', // Field in the 'posts' collection
			as: 'post' // Output field
		}
	}
];

// Joining 'comments' collection to 'posts' based on 'postId' with additional sorting and projection
export const joinCommentsPost = [
	{
		$lookup: {
			from: 'comments', // Target collection to join
			localField: '_id', // Field in the 'posts' collection
			foreignField: 'postId', // Field in the 'comments' collection
			as: 'comments', // Output field
			pipeline: [
				// Additional aggregation pipeline
				{$sort: {createdAt: -1}}, // Sorting comments by creation date
				{$project: {updatedAt: 0}} // Removing 'updatedAt' field from comments
			]
		}
	}
];

// Joining 'likes' collection to 'posts' with sorting, grouping user information, and additional projection
export const joinLikesPost = [
	{
		$lookup: {
			from: 'likes', // Target collection to join
			localField: '_id', // Field in the 'posts' collection
			foreignField: 'postId', // Field in the 'likes' collection
			as: 'likeInfo', // Output field
			pipeline: [
				// Additional aggregation pipeline
				{$sort: {createdAt: -1}}, // Sorting likes by creation date
				{
					$group: {
						_id: null, // Grouping to aggregate all likes
						usersId: {$push: '$userId'}, // Collecting user IDs who liked the post
						users: {
							// Collecting user information who liked the post
							$push: {
								firstName: '$firstName',
								lastName: '$lastName'
							}
						}
					}
				}
			]
		}
	},
	// Deconstructing 'likeInfo' array
	{$unwind: {path: '$likeInfo', preserveNullAndEmptyArrays: true}},
	// Projecting to exclude fields from 'likeInfo'
	{$project: {'likeInfo._id': 0, reactions: 0}}
];

// Joining 'users' collection to 'messages' based on 'senderId'
export const joinSentMessageUser = [
	{
		$lookup: {
			from: 'users', // Target collection to join
			localField: 'senderId', // Field in the 'messages' collection
			foreignField: '_id', // Field in the 'users' collection
			as: 'user', // Output field
			pipeline: [
				// Additional aggregation pipeline
				{
					$project: {
						firstName: 1,
						lastName: 1
					}
				}
			]
		}
	}
];
