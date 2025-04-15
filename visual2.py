import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import tkinter as tk

# List of joint coordinates
master_gong_bu_chong_quan = [
    (-315.33990, -532.44751, 1269.14111),  # Left Shoulder
    (-544.24274, -819.86749, 1246.98901),  # Right Shoulder
    (-25.55933, -498.01904, 1187.82007),   # Left Elbow
    (-745.96863, -751.89502, 964.75372),   # Right Elbow
    (194.10724, -641.67169, 1270.74231),   # Left Wrist
    (-701.79169, -621.17615, 719.50769),   # Right Wrist
    (-391.04510, -428.42917, 796.12347),   # Left Hip
    (-614.52740, -764.30566, 756.52966),   # Right Hip
    (-105.98969, -561.29327, 502.54788),   # Left Knee
    (-737.99744, -702.86261, 323.24124),   # Right Knee
    (-139.23065, -465.05334, 50.85522),    # Left Ankle
    (-1062.92981, -587.08008, 73.93146)    # Right Ankle
]

# Convert the list into a numpy array for easier manipulation
coords = np.array(master_gong_bu_chong_quan)

# Create a Tkinter window
root = tk.Tk()
root.title("3D 武术传承人")

# Create a 3D plot in a Matplotlib figure
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

# Plot the joints
ax.scatter(coords[:, 0], coords[:, 1], coords[:, 2], color='blue')

# Connect the joints to form the skeleton
# Define the connections between joints
connections = [
    (0, 2), (2, 4), # Left arm
    (1, 3), (3, 5), # Right arm
    (0, 6), (1, 7), # Shoulders to hips
    (6, 8), (7, 9), # Hips to knees
    (8, 10), (9, 11), # Knees to ankles
    (0, 1) # Shoulders
]

# Draw lines between connected joints
for conn in connections:
    ax.plot([coords[conn[0], 0], coords[conn[1], 0]],
            [coords[conn[0], 1], coords[conn[1], 1]],
            [coords[conn[0], 2], coords[conn[1], 2]], color='red')

# Set labels
ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_zlabel('Z')

# Set the aspect ratio to be equal
ax.set_box_aspect([1,1,1])

# Embed the plot in the Tkinter window
canvas = FigureCanvasTkAgg(fig, master=root)
canvas.draw()
canvas.get_tk_widget().pack()

# Start the Tkinter main loop
root.mainloop()
