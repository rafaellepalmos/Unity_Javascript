#pragma strict

	var speed : float = 50.0;
	var jumpSpeed : float = 8.0;
	var gravity : float = 20.0;
	public var bomb:GameObject;

	private var moveDirection : Vector3 = Vector3.zero;

	function Start () {
	}

	function Update() {
		var controller : CharacterController = GetComponent.<CharacterController>();
		if (controller.isGrounded) {
			// We are grounded, so recalculate
			// move direction directly from axes
			moveDirection = Vector3(-(Input.GetAxis("Horizontal")), 0,
			                        -(Input.GetAxis("Vertical")));
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
	        GetComponent.<Animation>().CrossFade ("run");
			
	    } else if (Mathf.Abs(Input.GetAxis("Horizontal")) > 0.1){
	        GetComponent.<Animation>().CrossFade ("run");
			
	    } else{
	       GetComponent.<Animation>().CrossFade ("idle");
	    }

	    if (Input.GetKey (KeyCode.X)){
			GetComponent.<Animation>().CrossFade ("attack");
		}
	}

	function OnTriggerEnter (other: Collider) {
		if(other.tag == "cube"){
			var position = other.transform.position;
			Instantiate(bomb, position, Quaternion.identity);
			Destroy(other.gameObject);//to destroy the cube upon impact
		}
	}