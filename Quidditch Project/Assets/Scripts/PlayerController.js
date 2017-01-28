/// This script moves the character controller forward 
	/// and sideways based on the arrow keys.
	/// It also jumps when pressing space.
	/// Make sure to attach a character controller to the same game object.
	/// It is recommended that you make only one call to Move or SimpleMove per frame.	

	var speed : float = 6.0;
	var jumpSpeed : float = 20.0;
	var gravity : float = 20.0;
	public var scorecanvas:GameObject;
	private var score:int = 0;
	public var scoreText:UI.Text;
	public var spherePrefab:GameObject;
	public var monsterPrefab:GameObject;
	//public var meteorPrefab:GameObject;
	public var bomb:GameObject;
	public var timer: float = 30.0;
	public var timerText:UI.Text;
	public var endcanvas:GameObject;
	public var hiscoreText:UI.Text;
	public var menu:UI.Button;
	public var replay:UI.Button;

	private var moveDirection : Vector3 = Vector3.zero;

	function Start(){
		//x -190 => 280
		for(var i = 1 ; i<= 50 ; i++ ){
			var position: Vector3 = Vector3(Random.Range(0, 500.0), 7, Random.Range(0, 500));
			Instantiate(spherePrefab, position, Quaternion.identity);//first param prefab, second param position
		} //position of the spheres

		for(var j = 1 ; j<= 30 ; j++ ){
			var slimeposition: Vector3 = Vector3(Random.Range(0, 500.0), 0, Random.Range(0, 500));
			Instantiate(monsterPrefab, slimeposition, Quaternion.identity);
		}

		/*for(var k = 1 ; k<= 5 ; k++ ){
			var meteorposition: Vector3 = Vector3(Random.Range(0, 500.0), 100, Random.Range(0, 500));
			Instantiate(meteorPrefab, meteorposition, Quaternion.identity);
		}*/
		endcanvas.GetComponent(Canvas).enabled = false;
		menu.onClick.AddListener(goToMenu);
		replay.onClick.AddListener(replayGame);
	}

	function Update() {
		var controller : CharacterController = GetComponent.<CharacterController>();
		if (controller.isGrounded) {
			// We are grounded, so recalculate
			// move direction directly from axes
			moveDirection = Vector3(Input.GetAxis("Horizontal"), 0,
			                        Input.GetAxis("Vertical"));
			moveDirection = transform.TransformDirection(moveDirection);
			moveDirection *= speed;
			
			if (Input.GetButton ("Jump")) {
				moveDirection.y = jumpSpeed;
			}
		}

		// Apply gravity
		moveDirection.y -= gravity * Time.deltaTime;
		// Move the controller
		controller.Move(moveDirection * Time.deltaTime);
		if (Mathf.Abs(Input.GetAxis("Vertical")) > 0.1){
	        GetComponent.<Animation>().CrossFade ("Walk");
			
	    }else{
	       GetComponent.<Animation>().CrossFade ("Wait");
	    }

	    if(Mathf.Abs(Input.GetAxis("Horizontal")) > 0.1){
			transform.rotation *= Quaternion.AngleAxis(100 * Input.GetAxis("Horizontal") * Time.deltaTime, Vector3.up);;
		}

		if (Input.GetKey (KeyCode.Z)){
			GetComponent.<Animation>().CrossFade ("Attack");
		}

		if (timer < 0.0){
			//Application.LoadLevel (1);
			showScore();
		}

		timer -= Time.deltaTime;//to count down
		timerText.text = timer.ToString("f1");//display timer real time. f1 is used to limit decimal places

	}

	function OnTriggerEnter (other : Collider) {
		if(other.tag == "circle"){
			score++; //to increment score
			scoreText.text = "Coins: " + score.ToString (); //to display score
			var position = other.transform.position;
			Instantiate(bomb, position, Quaternion.identity);
			Destroy(other.gameObject);//to destroy the circle upon impact
		} else if (other.tag == "slime") {
			score--; //to decrement score
			scoreText.text = "Coins: " + score.ToString ();
			Destroy(other.gameObject);
		} /*else if (other.tag == "meteor") {
			GetComponent.<Animation>().CrossFade ("Dead");
		}*/
	}

	function showScore(){
		endcanvas.GetComponent(Canvas).enabled = true;
		scorecanvas.GetComponent(Canvas).enabled = false;
		hiscoreText.text = "Your score is: " + score.ToString ();
	}

	function goToMenu(){
		Application.LoadLevel (1);
	}

	function replayGame(){
		Application.LoadLevel (0);
	}

	//destroy meteor and instantiate
	/*function OnCollisionEnter (col : Collision) {
		if(col.GameObject.tag == "floor"){
			Destroy(col.gameObject);
			for(var m = 1 ; m<= 5 ; m++ ){
			var metposition: Vector3 = Vector3(Random.Range(0, 500.0), 100, Random.Range(0, 500));
			Instantiate(meteorPrefab, metposition, Quaternion.identity);
			}
		}
	}*/