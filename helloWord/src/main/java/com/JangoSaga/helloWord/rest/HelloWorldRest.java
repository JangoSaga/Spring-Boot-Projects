package com.JangoSaga.helloWord.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorldRest {

    @GetMapping("/")
    public String sayHelloWorld() {
        return "Hello World, I am entering in spring boot";
    }

}
