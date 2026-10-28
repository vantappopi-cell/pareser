const fileInput = document.getElementById('jsonFile')

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0]
    const reader = new FileReader()
    
    reader.onload = function(event) {
        const formData = JSON.parse(event.target.result)
        renderForm(formData)
    }
    reader.readAsText(file)
})

function renderForm(data) {
    const container = document.getElementById('formContainer')
    container.innerHTML = ''

    const form = document.createElement('form')

    const h2 = document.createElement('h2')
    h2.textContent = data.name
    form.appendChild(h2)

    for (let i = 0; i < data.fields.length; i++) {
        const field = data.fields[i]
        const formGroup = document.createElement('div')
        formGroup.classList.add('form-group')

        const label = document.createElement('label')
        label.textContent = field.label
        formGroup.appendChild(label)

        let inputElement

        if (field.input.type === 'textarea') {
            inputElement = document.createElement('textarea')
        } else if (field.input.type === 'technology') {
            inputElement = document.createElement('select')
            for (let j = 0; j < field.technologies.length; j++) {
                const option = document.createElement('option')
                option.value = field.technologies[j]
                option.textContent = field.technologies[j]
                inputElement.appendChild(option)
            }
        } else {
            inputElement = document.createElement('input')
            inputElement.type = field.input.type
        }

        if (field.input.placeholder) {
            inputElement.placeholder = field.input.placeholder
        }
        if (field.input.required) {
            inputElement.required = true
        }
        if (field.input.checked) {
            inputElement.checked = true
        }

        inputElement.name = field.label
        formGroup.appendChild(inputElement)

        if (field.input.type === 'color' && field.colors) {
            const colorDiv = document.createElement('div')
            for (let c = 0; c < field.colors.length; c++) {
                const badge = document.createElement('div')
                badge.style.width = '20px'
                badge.style.height = '20px'
                badge.style.borderRadius = '50%'
                badge.style.display = 'inline-block'
                badge.style.backgroundColor = field.colors[c]
                badge.style.cursor = 'pointer'
                badge.style.marginRight = '5px'
                
                badge.addEventListener('click', function() {
                    inputElement.value = field.colors[c]
                })
                colorDiv.appendChild(badge)
            }
            formGroup.appendChild(colorDiv)
        }

        form.appendChild(formGroup)
    }

    if (data.references) {
        for (let r = 0; r < data.references.length; r++) {
            const refItem = data.references[r]
            const refDiv = document.createElement('div')

            if (refItem.input) {
                const chk = document.createElement('input')
                chk.type = 'checkbox'
                chk.name = refItem.text
                if (refItem.input.required) chk.required = true
                
                const span = document.createElement('span')
                span.textContent = refItem.text
                
                refDiv.appendChild(chk)
                refDiv.appendChild(span)
            } else {
                if (refItem.text_without_ref) {
                    const textNode = document.createTextNode(refItem.text_without_ref + ' ')
                    refDiv.appendChild(textNode)
                }
                const a = document.createElement('a')
                a.href = refItem.ref
                a.textContent = refItem.text
                refDiv.appendChild(a)
            }
            form.appendChild(refDiv)
        }
    }

    const btnDiv = document.createElement('div')
    for (let b = 0; b < data.buttons.length; b++) {
        const button = document.createElement('button')
        button.textContent = data.buttons[b].text
        if (b === 0) {
            button.type = 'submit'
        } else {
            button.type = 'button'
        }
        btnDiv.appendChild(button)
    }
    form.appendChild(btnDiv)

    form.addEventListener('submit', function(event) {
        event.preventDefault()
        
        const result = {}
        const elements = form.elements
        
        for (let e = 0; e < elements.length; e++) {
            const el = elements[e]
            if (el.name) {
                if (el.type === 'checkbox') {
                    result[el.name] = el.checked
                } else {
                    result[el.name] = el.value
                }
            }
        }
        
        console.log(result)
    })

    container.appendChild(form)
}
