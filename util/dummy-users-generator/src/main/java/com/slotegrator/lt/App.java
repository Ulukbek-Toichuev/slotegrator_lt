package com.slotegrator.lt;

import picocli.CommandLine;

public class App {

    public static void main( String[] args ) {
        int exitCode = new CommandLine(new UserGenerator()).execute(args);
        System.exit(exitCode);
    }
}
