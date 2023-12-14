const compose = (...functions) => data =>
    functions.reduceRight((value, func) => func(value), data)


const $DESCRIPTION = document.getElementById('Descripción');
const $CALORIES = document.getElementById('Calorias');
const $CARBS = document.getElementById('Carbohidratos');
const $PROTEIN = document.getElementById('Proteinas');


const $ADD_BUTTON = document.getElementById('add');

const IS_INVALID = 'is-invalid'

let itemsList = [];

const attrToString = (obj = {}) =>
    Object.keys(obj)
        .map(key => `${key}="${obj[key]}"`)
        .join(' ')

const tagAttrs = obj => (content = '') =>
    `<${obj.tag}${obj.attrs ? ' ' : ''}${attrToString(obj.attrs)}> ${content} </${obj.tag}>`;

const inputAttrs = obj =>
    `<${obj.tag}${obj.attrs ? ' ' : ''}${attrToString(obj.attrs)}>`;

const tag = nameTag =>
    typeof nameTag === 'string' ? tagAttrs({ tag: nameTag }) : tagAttrs(nameTag);

const inputTag = nameTag =>
    typeof nameTag === 'string' ? inputAttrs({ tag: nameTag }) : inputAttrs(nameTag);

// const tableRow = (items) => tableRowTag(tableCells(items))

const tableCell = tag('td');
const tableCells = items => items.map(tableCell).join('');

const add = (list) => {
    const newItem = {
        descripcion: $DESCRIPTION.value,
        calorias: parseInt($CALORIES.value),
        carbohidratos: parseInt($CARBS.value),
        proteinas: parseInt($PROTEIN.value),
    }


    list.push(newItem);
    console.log(list);
}

const clearInputs = () => {
    $DESCRIPTION.value = '';
    $CALORIES.value = '';
    $CARBS.value = '';
    $PROTEIN.value = '';
}

const removeItem = index => {
    itemsList.splice(index, 1);
    updateTotal()
    renderItems();
}

const editItem = index => {
    const $rowToEdit = document.querySelectorAll(`#list-item-${index} td input`);
    const $buttonMOD = document.querySelector(`#list-item-${index} td .edit`)

    if ($buttonMOD.getAttribute('data-status') == 'start') {
        Array.prototype.map.call($rowToEdit, item => { item.disabled = false; item.classList.add('enabled') });
        $buttonMOD.setAttribute('data-status', 'finish')
    }
    else {
        const newItem = {
            descripcion: $rowToEdit[0].value,
            calorias: parseInt($rowToEdit[1].value),
            carbohidratos: parseInt($rowToEdit[2].value),
            proteinas: parseInt($rowToEdit[3].value),
        }

        itemsList[index].descripcion = newItem.descripcion;
        itemsList[index].calorias = newItem.calorias;
        itemsList[index].carbohidratos = newItem.carbohidratos;
        itemsList[index].proteinas = newItem.proteinas;

        Array.prototype.map.call($rowToEdit, item => { item.disabled = true; item.classList.remove('enabled') });
        $buttonMOD.setAttribute('data-status', 'start')

        updateTotal();

        console.log('Elementos Editados');
    }
}

const updateTotal = () => {
    let calorias = 0, carbohidratos = 0, proteinas = 0;

    itemsList.map((item) => {
        calorias += item.calorias;
        carbohidratos += item.carbohidratos;
        proteinas += item.proteinas;
    });

    document.getElementById('total-calorias').textContent = calorias;
    document.getElementById('total-carbohidratos').textContent = carbohidratos;
    document.getElementById('total-proteinas').textContent = proteinas;
}

const renderItems = () => {
    const $TBODY = document.getElementById('list-items');

    const rows = itemsList.map((item, index) => {
        const tableRowTag = tag({ tag: 'tr', attrs: { id: `list-item-${index}` } });

        const tableRow = (items) => compose(tableRowTag, tableCells)(items);

        const descripcionInput = {
            tag: 'input',
            attrs: {
                type: 'text',
                name: 'Descripción',
                disabled: 'true',
                value: item.descripcion,
            }
        };

        const caloriasInput = {
            tag: 'input',
            attrs: {
                type: 'number',
                name: 'calorias',
                disabled: 'true',
                value: item.calorias,
            }
        };

        const carbohidratosInput = {
            tag: 'input',
            attrs: {
                type: 'number',
                name: 'carbohidratos',
                disabled: item.carbohidratos,
                value: item.carbohidratos,
            }
        };

        const proteinasInput = {
            tag: 'input',
            attrs: {
                type: 'number',
                name: 'proteinas',
                disabled: 'true',
                value: item.proteinas,
            }
        };

        const descripcion = inputAttrs(descripcionInput);
        const calorias = inputAttrs(caloriasInput);
        const carbohidratos = inputAttrs(carbohidratosInput);
        const proteinas = inputAttrs(proteinasInput);

        const buttonsArray = [
            {
                tag: 'button',
                attrs:
                {
                    class: 'remove',
                    onclick: `removeItem(${index})`,
                }
            },
            {
                tag: 'button',
                attrs:
                {
                    class: 'edit',
                    onclick: `editItem(${index})`,
                    'data-status': 'start',
                }
            },
        ]

        const buttons = buttonsArray.map(item => tag(item)('')).join('');

        return tableRow([descripcion, calorias, carbohidratos, proteinas, buttons]);
    }).join('');

    $TBODY.innerHTML = rows;
}

const validateInputs = () => {
    if ($DESCRIPTION.value && $CALORIES.value && $CARBS.value && $PROTEIN.value) {
        add(itemsList);
        clearInputs();
        updateTotal();
        renderItems();
    }
    else {
        $DESCRIPTION.classList.add(IS_INVALID);
        $CALORIES.classList.add(IS_INVALID);
        $CARBS.classList.add(IS_INVALID);
        $PROTEIN.classList.add(IS_INVALID);
    }
}

$ADD_BUTTON.addEventListener('click', validateInputs);

$DESCRIPTION.addEventListener('keyup', () => { $DESCRIPTION.classList.remove(IS_INVALID) });

$CALORIES.addEventListener('keyup', () => { $CALORIES.classList.remove(IS_INVALID) });

$CARBS.addEventListener('keyup', () => { $CARBS.classList.remove(IS_INVALID) });

$PROTEIN.addEventListener('keyup', () => { $PROTEIN.classList.remove(IS_INVALID) });

window.addEventListener('beforeunload', () => { localStorage.setItem('items', JSON.stringify(itemsList)) });

(() => {
    items = JSON.parse(localStorage.getItem('items'));
    console.log(items);
    items.length === 0 ? 0
        : itemsList = items,
        updateTotal(),
        renderItems();
})();