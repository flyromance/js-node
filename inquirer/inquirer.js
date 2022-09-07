const inquirer = require("inquirer");

inquirer
  .prompt([
    {
      type: "list",
      name: "list",
      choices: [
        {
          value: "123",
          name: "title123",
        },
        {
          value: "321",
          name: "title321",
        },
      ],
    },
    {
      type: "rawlist",
      name: "rawlist",
      choices: [
        {
          value: "123",
          name: "title123",
        },
        {
          value: "321",
          name: "title321",
        },
      ],
    },
    {
        type: 'checkbox',
        name: 'checkbox',
        choices: [
            "ddd",
            new inquirer.Separator('hhhhh'),
            "ddd",
        ],
        require: true
    }
  ])
  .then((a) => {
    console.log(a);
  })
  .catch(() => {});
