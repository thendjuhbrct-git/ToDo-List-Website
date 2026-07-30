const container = document.getElementById('todo-container');
const imports = document.getElementById('import-btn');
const file = document.getElementById('import-file');


function SaveList() {
    const inputstext = container.querySelectorAll('.todo-text');
    const list = [];

    inputstext.forEach(input => {
        if (input.value.trim().length > 0) {
            list.push(input.value);
        }
    });

    localStorage.setItem('my-list', JSON.stringify(list));
}

function LoadList() {
    const saved = localStorage.getItem('my-list');

    if (saved) {
        const list = JSON.parse(saved);

        container.innerHTML = '';

        list.forEach(text => {
            const newdiv = document.createElement('div');
            newdiv.classList.add('todo-items');
            newdiv.innerHTML = `
            <input type="checkbox" class="todo-checkbox">
            <input type="text" class="todo-text" value="${text}">
            `;
            container.appendChild(newdiv)
        });
    }

    NewLine();
}

function NewLine() {
    const newdiv = document.createElement('div')

    newdiv.classList.add('todo-items');
    newdiv.innerHTML = `
    <input type="checkbox" class="todo-checkbox" disabled>
    <input type="text" class="todo-text" placeholder="Add a task...">
    `;
    container.appendChild(newdiv);
}

container.addEventListener('input', (e) => {
    if (!e.target.classList.contains('todo-text')) return;

    const current = e.target.closest('.todo-items');
    const checkbox = current.querySelector('.todo-checkbox');
    const items = container.querySelectorAll('.todo-items');
    const isLast = current === items[items.length - 1];

    if (e.target.value.trim().length > 0) {
        checkbox.disabled = false;

        if (isLast) {
            NewLine();
        }
    } else {
        checkbox.disabled = true;

        if (items.length > 1 && !isLast) {
            current.remove()
        }
    }

    SaveList();
});

container.addEventListener('change', (e) => {
    if (!e.target.classList.contains('todo-checkbox')) return;

    const current = e.target.closest('.todo-items');

    if (e.target.checked) {
        setTimeout(() => {
            const items = container.querySelectorAll('.todo-items');
            if (items.length > 1) {
                current.remove();
                SaveList();
            } else {
                e.target.checked = false;
                e.target.disabled = true;
                current.querySelector('.todo-text').value = '';
                SaveList();
            }
        }, 600);
    }
});

document.getElementById('export-btn').addEventListener('click', () => {
    const data = localStorage.getItem('my-list');
    if (!data) {
        alert("List is empty, nothing to export !");
        return;
    }

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'todo-list.json';
    a.click();

    URL.revokeObjectURL(url);
})

imports.addEventListener('click', () => {
    file.click();
});

file.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const content = event.target.result;
            JSON.parse(content);

            localStorage.setItem('my-list', content);
            LoadList();
            alert("List successfully imported !");
        } catch (error) {
            alert("Oops, this file isn't a valid JSON !");
        }
    };
    reader.readAsText(file);

    files.value = '';
});

LoadList();
