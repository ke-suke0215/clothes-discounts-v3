// app/routes/ping.tsx
export const loader = async () => {
	return Response.json({
		status: 'ok',
	});
};
