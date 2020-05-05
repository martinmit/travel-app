import { displayPastTrips } from "../src/client/js/app";

test('Testing the function', () => {
    expect(displayPastTrips).toBeInstanceOf(Function);
})