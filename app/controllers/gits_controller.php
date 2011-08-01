<?php

class GitsController extends AppController {

  var $name = 'Gits';
  var $helpers = array();
  var $uses = array();

  function beforeFilter() {
    $this->autoRender = FALSE;
    parent::beforeFilter();
  }

  function checkout($redir = '/') {

    if(empty ($this->passedArgs['branch'])) return;
    
    $branch = $this->passedArgs['branch'];
    $git = $this->run_git($branch);
    $this->log($git, LOG_DEBUG);
    
    if($redir != $this->params['action']) {
      $this->redirect(array('controller' => $redir));
    }
    
    $this->redirect($redir);
  }
  
  function run_git($branch) {
    if(!defined ('OS')) {
      //die( );
    } 
    if (OS === OS_MS) {
      $p = 'Windows  ';
      $op = `"D:\Program Files\Git\bin\git.exe" checkout $branch 2>&1`;
    }
    if (OS === OS_UX) {
      $p = 'Mac OS X  ';
      $op = `git checkout $branch 2>&1`;
    }
    $this->log($_SERVER['SERVER_SOFTWARE'], LOG_DEBUG);
    return ($op.'\r\n'.$p);
  }
}
