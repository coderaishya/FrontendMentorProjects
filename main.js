const projects = [
	{
		name: 'multi-step-form',
		github:
			'https://github.com/coderaishya/FrontendMentorProjects/tree/master/multi-step-form'
	},
	{
		name: 'faq-accordin',
		github:
			'https://github.com/coderaishya/FrontendMentorProjects/tree/master/faq-accordin'
	},
	{
		name: 'random-advice-generator',
		github:
			'https://github.com/coderaishya/FrontendMentorProjects/tree/master/random-advice-generator'
	},
	{
		name: 'comments-section',
		github:
			'https://github.com/coderaishya/FrontendMentorProjects/tree/master/comments-section'
	},
	{
		name: 'bento-grid',
		github:
			'https://github.com/coderaishya/FrontendMentorProjects/tree/master/bento-grid'
	}
	
];

const list = document.getElementById('list');

projects.forEach(({ name, github }, i) => {
	const listItem = document.createElement('li');

	listItem.innerHTML = `
		<a href="${name}/index.html">
			<img src="${name}/design/desktop-design.jpg" alt="${name}" />
			<p>${i + 1}. ${formatProjectName(name)}</p>
		</a>
		<div class="links-container">
			<a href="./${name}/index.html" class="blue">
				<i class="fas fa-eye"></i>
			</a>
			<a href="${github}" class="github">
				<i class="fab fa-github"></i>
			</a>
		</div>
	`;

	list.appendChild(listItem);
});

function formatProjectName(name) {
	return name
		.split('-')
		.map(word => word[0].toUpperCase() + word.slice(1))
		.join(' ');
}