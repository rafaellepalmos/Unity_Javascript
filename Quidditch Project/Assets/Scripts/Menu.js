#pragma strict

public var play:UI.Button;

function Start () {
	play.onClick.AddListener(playGame);
}

function Update () {

}

function playGame(){
	Application.LoadLevel (0);
}