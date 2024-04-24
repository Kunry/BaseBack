export const randmonTimeOutControl = () => {
	return new Promise((resolve) => {
		setTimeout(
			() => {
				resolve('done!');
			},
			Math.floor(Math.random() * 1000)
		);
	});
};

export const randomErrorControl = () => {
	return new Promise((resolve, reject) => {
		setTimeout(
			() => {
				if (Math.random() < 0.1) {
					reject(new Error('random error!'));
				} else {
					resolve('done!');
				}
			},
			Math.floor(Math.random() * 1000)
		);
	});
};
