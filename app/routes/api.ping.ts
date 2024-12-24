// GET /api/ping
export const loader = async () => {
	return Response.json({
		status: 'ok',
	});
};
