$(document).ready(function() {
	let observer = new MutationObserver(mutationRecords => {

		let sCoupleId = mutationRecords[0].target.dataset.coupleId;

		//добавить на всякий случай removeEventListener и unobserve для данного элемента
		document.querySelector('div[data-couple-id="'+sCoupleId+'"]').remove();

		let customSelect = createCustomSelect(mutationRecords[0].target);
		mutationRecords[0].target.parentNode.insertBefore(customSelect, mutationRecords[0].target);

		observer.observe(mutationRecords[0].target, {
			childList: true, // наблюдать за непосредственными детьми
			subtree: false, // и более глубокими потомками
			characterDataOldValue: false // передавать старое значение в колбэк
		});
	});

	document.querySelectorAll('select[data-couple-id]').forEach(element => {
		let customSelect = createCustomSelect(element);
		element.parentNode.insertBefore(customSelect, element);

		observer.observe(element, {
			childList: true, // наблюдать за непосредственными детьми
			subtree: false, // и более глубокими потомками
			characterDataOldValue: false // передавать старое значение в колбэк
		});
	})

	function createCustomSelect(parentSelect) {
		console.log(parentSelect);
		if(!Boolean(parentSelect) || !Boolean(parentSelect.dataset.coupleId)){
			console.error('Does not set data-couple-id for select');
			return false;
		}

		let main_div = document.createElement('div');
		main_div.className = 'w-100 text-left dropdown';
		main_div.setAttribute('data-couple-id', parentSelect.dataset.coupleId);

		let dropdown_menu_div = document.createElement('div');
		dropdown_menu_div.className = 'dropdown-menu custom-select-dropdown';
		dropdown_menu_div.setAttribute('x-placement', 'top-start');
		dropdown_menu_div.setAttribute('aria-labelledby', 'customSelectDropdown'+parentSelect.dataset.coupleId);

		parentSelect.querySelectorAll('option').forEach(function(el, index) {
			if(index == 0) {
				let button = document.createElement('button');
				button.className = 'custom-select-dropdown btn btn-secondary dropdown-toggle';
				button.id = 'customSelectDropdown'+parentSelect.dataset.coupleId;
				button.textContent = el.textContent;
				button.setAttribute('data-value', el.value);
				button.setAttribute('data-title', el.textContent);
				button.setAttribute('data-couple-id', parentSelect.dataset.coupleId);
				button.setAttribute('type', 'button');
				button.setAttribute('data-toggle', 'dropdown');
				button.setAttribute('aria-haspopup', 'true');
				button.setAttribute('aria-expanded', 'false');
				main_div.appendChild(button);
			}

			let a_into_div = document.createElement('a');
			a_into_div.className = 'dropdown-item custom-select-dropdown';
			a_into_div.textContent = el.textContent;
			a_into_div.setAttribute('href', 'javascript:void(0)');
			a_into_div.setAttribute('data-value', el.value);
			a_into_div.setAttribute('data-title', el.textContent);
			a_into_div.setAttribute('data-couple-id', parentSelect.dataset.coupleId);

			dropdown_menu_div.appendChild(a_into_div);

			addListenerToCustomOption(a_into_div);
		});

		main_div.appendChild(dropdown_menu_div);

		return main_div;
	}

	function addListenerToCustomOption(option) {
		option.addEventListener('click', function(event) {
			changeCustomSelectButtonData(event);

			document.querySelector('select[data-couple-id="'+event.target.dataset.coupleId+'"]').value = event.target.dataset.value;
		});
	}

	function changeCustomSelectButtonData(event) {
		let coupleId = event.target.dataset.coupleId;

		let button = document.querySelector(`button.custom-select-dropdown[data-couple-id="${coupleId}"]`);

		button.dataset.value = event.target.dataset.value;
		button.dataset.title = event.target.dataset.title;
		button.textContent =event.target.dataset.title;
	}
});
