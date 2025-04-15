import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import numpy as np
plt.rcParams['font.sans-serif'] = ['Microsoft YaHei']  # '微软雅黑'
plt.rcParams['axes.unicode_minus'] = False  # 解决负号问题（例如在坐标轴上显示）
# Define points A and B
point_a = np.array([3, 4, 6])
point_b = np.array([9, 11, 12])

# Calculate vector from A to B
vector_ab = point_b - point_a

# Create triangle points: A, B, and C (C will have the same x, y as B, and z as A)
point_c = np.array([point_b[0], point_b[1], point_a[2]])

# Setting up the plot
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

# Plotting the vector from point A to point B
ax.quiver(point_a[0], point_a[1], point_a[2], vector_ab[0], vector_ab[1], vector_ab[2], color='blue', arrow_length_ratio=0.1)

# Adding points to the plot
ax.scatter(*point_a, color='red', label='关节 A (3, 4, 6)', s=100)
ax.scatter(*point_b, color='green', label='关节 B (9, 11, 12)', s=100)
ax.scatter(*point_c, color='purple', label='点 C', s=100)  # Point C is the right angle point of the triangle

# Plotting the triangle lines
ax.plot([point_a[0], point_b[0]], [point_a[1], point_b[1]], [point_a[2], point_b[2]], color='blue')  # AB
ax.plot([point_a[0], point_c[0]], [point_a[1], point_c[1]], [point_a[2], point_c[2]], color='purple', linestyle='dashed')  # AC
ax.plot([point_c[0], point_b[0]], [point_c[1], point_b[1]], [point_c[2], point_b[2]], color='orange', linestyle='dashed')  # BC

# Setting labels and legend
ax.set_xlabel('X 轴')
ax.set_ylabel('Y 轴')
ax.set_zlabel('Z 轴')
ax.legend()

# Setting plot title and limits for better visibility
ax.set_title('3D 可视化肢体在空间中夹角关系')
ax.set_xlim(0, 15)
ax.set_ylim(0, 15)
ax.set_zlim(0, 15)

plt.show()

