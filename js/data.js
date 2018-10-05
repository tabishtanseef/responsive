const MASTER_DB = {
  "CONFIG": {
    "HINT": 2,
    "TITLE": "Listen Carefully and give the answer.",
    "INSTRUCTION": "",
    "INSTRUCTIONS": [
      "Click <b>Start</b> to begin the activity.",
      "Questions will appear one by one.",
      "Click the correct option. You can change your answer.",
	    "Once you have decided on your answer, press Submit."
    ],
    "FEEDBACK_TIME": 4500,
    "RESULT_TIME": 2000
  },

	"AUDIO": {
		"COMPLETE": [
			"audio/well-done.mp3",
		],
		"POSITIVE": [
			"audio/well-done.mp3"
		],
		"NEGATIVE": [
			"audio/try-again.mp3"
		]
	},

  "COMPLETE": {
    "TEXT": [
      "YIPPEE! <br/> You have completed the activity!",
      "CONGRAUTLATIONS! You are a star!"
    ]
  },

  "QUESTIONS": [
    {
     //"figure": "img/question.png",
     // "figcaption": "",
      "title": " Is the ball big or small?",
      "options": {
        "Big": true,
        "small": false
      },
      "feedback": {
        "positive": "<img src='img/correct_Img.gif'>",
        "negative": "<img src='img/incorrect_Img.gif'>"
      }
    },
    {
      "title": "Is there an aeroplane or a toy bus in the box?",
      "options": {
        "Aeroplane": true,
        "Toy bus": false
      },
      "feedback": {
        "positive": "<img src='img/correct_Img.gif'>",
        "negative": "<img src='img/incorrect_Img.gif'>"
      }
    },
    {
      "title": "Is the toy car tiny or big?",
      "options": {
        "Big": false,
        "Tiny": true
      },
      "feedback": {
        "positive": "<img src='img/correct_Img.gif'>",
        "negative": "<img src='img/incorrect_Img.gif'>"
      }
    },
    {
      "title": "Is there a toy train or a toy van in the box?",
      "options": {
        "Toy train": true,
        "Toy van": false
      },
      "feedback": {
        "positive": "<img src='img/correct_Img.gif'>",
        "negative": "<img src='img/incorrect_Img.gif'>"
      }
	  
	  
    }
    
  ],
  "ANSWERS": {
    "INSTRUCTION": "Answer key"
  }
  
}
