table "acted_in", :embed_in => :movies, :on => :idmovies  do
	column "idacted_in", :key, :as => :integer
	column "idmovies", :key, :as => :integer
	column "idseries", :key, :as => :integer
	column "idactors", :key, :as => :integer
	column "character", :string
	column "billing_position", :integer
end

table "actors" do
	column "idactors", :key, :as => :integer
	column "lname", :string
	column "fname", :string
	column "mname", :string
	column "gender", :integer
	column "number", :integer
end

table "aka_names", :embed_in => :actors, :on => :idactors  do
	column "idaka_names", :integer
	column "idactors", :key, :as => :integer
	column "name", :string
end

table "aka_titles", :embed_in => :movies, :on => :idmovies  do
	column "idaka_titles", :key, :as => :integer
	column "idmovies", :key, :as => :integer
	column "title", :string
	column "location", :string
	column "year", :integer
end

table "genres" do
	column "idgenres", :key, :as => :integer
	column "genre", :string
end

table "keywords" do
	column "idkeywords", :key, :as => :integer
	column "keyword", :string
end

table "movies" do
	column "idmovies", :integer
	column "title", :string
	column "year", :integer
	column "number", :integer
	column "type", :integer
	column "location", :string
	column "language", :string
end

table "movies_genres", :embed_in => :movies, :on => :idmovies  do
	column "idmovies_genres", :key, :as => :integer
	column "idmovies", :key, :as => :integer
	column "idgenres", :key, :as => :integer
	column "idseries", :key, :as => :integer
end

table "movies_keywords", :embed_in => :movies, :on => :idmovies  do
	column "idmovies_keywords", :key, :as => :integer
	column "idmovies", :key, :as => :integer
	column "idkeywords", :key, :as => :integer
	column "idseries", :key, :as => :integer
end

table "series" do
	column "idseries", :key, :as => :integer
	column "idmovies", :key, :as => :integer
	column "name", :string
	column "season", :integer
	column "number", :integer
end

