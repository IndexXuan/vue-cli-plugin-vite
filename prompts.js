module.exports = [
  {
    type: 'list',
    name: 'htmlInitMethod',
    message: 'Please select the HTML init method',
    choices: [
      { name: 'default (Create a new HTML in the root directory)', value: 'vite' },
      { name: 'vue-cli (Copy from public/index.html)', value: 'vue-cli' },
    ],
    default: 'vite',
  },
]
