# Create shared components in src/components
SHARED_COMPONENTS_DIR="src/components"
mkdir -p "$SHARED_COMPONENTS_DIR"

for component in \
  BrandGrid BrandCard ProductGrid ProductCard SidebarBrands \
  ModelsGrid ModelVariantsDropdown ModelInfoCard Loader EmptyState
do
  COMPONENT_FILE="$SHARED_COMPONENTS_DIR/${component}.jsx"
  touch "$COMPONENT_FILE"
  echo "Created: $COMPONENT_FILE"
done
# To run this script, use:
# bash /c:/Users/HP/Desktop/Gama\ Express\ Web/Gama-Express/src/create-gama-pages.sh
# or, if you are in the script's directory:
# bash create-gama-pages.sh