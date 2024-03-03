
 Billiard Simulation

This project is a billiard simulation implemented using Three.js, a JavaScript library for creating 3D graphics in web browsers. The simulation adheres to specific requirements outlined for the project, including realistic table proportions, ball movement, collisions, lighting, and shadows.

 Requirements

 1. Table and Environment
- A billiard table of realistic proportions is created, complete with cushions and legs.
- The table is placed on the ground to provide a realistic setting.

 2. Billiard Balls
- Eight billiard balls are added, initially placed at random, non-overlapping positions on the table.
- Each ball is assigned a random velocity vector for movement.
- The speed of each ball decreases by 20% each second due to friction, ensuring realistic motion.
- Balls roll without slip to simulate authentic rolling motion.
- Reflection off the cushions is implemented, with the speed of a ball decreasing by 20% at each reflection.

 3. Textures
- Texture images from the `PoolBallSkins` directory are applied to the eight billiard balls for visual realism.

 4. Collisions
- Elastic collisions between billiard balls are implemented, reducing the speed of a ball by 30% at each collision.
- Collisions are handled dynamically to simulate realistic interactions between balls.

 5. Lighting and Shadows
- A ceiling is added to the scene, along with a spot light positioned above the table.
- The spot light is represented by a yellow light bulb, connected to the ceiling with a cord.
- Shadows of the table are visible on the ground, along with shadows of the billiard balls on the table surface.

 6. Scalability
- The project is designed to accommodate the addition of more balls in the future without copying and pasting code.
- A loop is used to handle the creation and management of multiple balls, ensuring efficient and scalable implementation.

 Usage

To experience the billiard simulation, simply run the provided HTML file in a compatible web browser. Use the mouse or keyboard controls to interact with the simulation and observe the realistic behavior of the billiard balls.

 Credits

This project was developed as part of a course assignment and utilizes the Three.js library for 3D graphics rendering. Special thanks to the course instructors and contributors to the Three.js library for their valuable resources and documentation.
